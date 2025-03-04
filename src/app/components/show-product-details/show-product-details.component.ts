import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { FileService } from 'src/app/services/file.service';
import { ProductService } from 'src/app/services/product.service';
import { saveAs } from 'file-saver'; // Importa file-saver


import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit{

  public products: Product[] = [];
  public showImageModal: boolean = false;
  public selectedImages: string[] = [];
  
  currentPage: number = 0;  // Página actual
  totalPages: number = 0;   // Total de páginas
  totalElements: number = 0; // Total de elementos (productos)
  pageSize: number = 10;     // Tamaño de página
  pages: number[] = [];      // Array de números de página para el paginador
  searchKey: string = ''; 

  public isGeneratingFile: boolean = false;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private router: Router,
    private fileService: FileService
  ) {

  }
  ngOnInit(): void {
    this.getAllProductsPaginated(this.currentPage, this.pageSize);
  }

  getAllProductsPaginated(page: number, size: number): void {
    this.productService.getAllProductsPaginated(page, size).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pageSize = response.pageSize;

        // Crear el array de páginas a mostrar
        this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
      }, error: (err) => {
        this.toastrService.error('Error, could not retrieve the product list  ' + err.error, 'Error')
      }
    });
  }

  // Cambiar la página
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllProductsPaginated(page, this.pageSize);
    }
  }

  getVisiblePages(): number[] {
    const range = 2; // Número de páginas a mostrar antes y después de la página actual
    const start = Math.max(0, this.currentPage - range);
    const end = Math.min(this.totalPages - 1, this.currentPage + range);
    
    const visiblePages = [];
    
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  }
  

  public delete(productId: number) {
    Swal.fire({
      title: 'Do you really want to delete this product?',
      text: 'You will not be able to revert this operation',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.toastrService.success(`Product deleted successfully`, 'Success');
            this.getAllProductsPaginated(this.currentPage, this.pageSize);
          }, error: (error) => {
            const errorMessage = error?.error?.message || 'An unexpected error occurred.';
            this.toastrService.error(`Error while deleting the product: ${errorMessage}`, 'Error');
          }
        });
      }
    });
  }

  editProductDetails(productId: number) {
    this.router.navigate(['/editProduct', productId]);
  }

  public viewImages(product: Product) {
    if (!product.productImages || product.productImages.length === 0) {
      this.toastrService.warning('No images available for this product', 'Warning');
      return;
    }
  
    // Construir la URL completa de las imágenes
    this.selectedImages = product.productImages.map(img => `data:${img.type};base64,${img.picByte}`); 
    this.showImageModal = true;
  }
  
  public generatePdf(): void {
    this.isGeneratingFile = true;
    this.fileService.getPdf().pipe(
      finalize(() => {
        setTimeout(() => {
          this.isGeneratingFile = false;
        }, 1000);
      })
    ).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, 'product-list.pdf'); // Descargar el archivo
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
        this.toastrService.error('Error generating PDF', 'Error');
      }
    });
  }

  // Función para descargar el CSV
  public generateCsv(): void {
    this.isGeneratingFile = true;
    this.fileService.getCsv().pipe(
      finalize(() => {
        setTimeout(() => {
          this.isGeneratingFile = false;
        }, 1000);
      })
    ).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'product_list.csv';
        link.click();
        URL.revokeObjectURL(link.href);
      }, error: (err) => {
        console.error('Error generating CSV:', err);
        this.toastrService.error('Error generating CSV', 'Error');
      }
    });
  }

  // Function to download the Excel file
  public generateExcel(): void {
    this.isGeneratingFile = true;
    this.fileService.getExcel().pipe(
      finalize(() => {
        setTimeout(() => {
          this.isGeneratingFile = false;
        }, 1000);
      })
    ).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'product_list.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
      }, 
      error: (err) => {
        console.error('Error generating Excel:', err);
        this.toastrService.error('Error generating Excel', 'Error');
      }
    });
  }

  searchProducts(searchKey: string): void {
    this.searchKey = searchKey;
    if (this.searchKey.trim() === '') {
      this.getAllProductsPaginated(this.currentPage, this.pageSize);
    } else {
      this.productService.searchProducts(this.searchKey, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.products = response.content;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.pageSize = response.pageSize;

            // Crear el array de páginas a mostrar
            this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
          }, error: (err) => {
            this.toastrService.error('An unexpected error occurred: ' + err.error, 'Error')
          }
        });
    }
  }

}
