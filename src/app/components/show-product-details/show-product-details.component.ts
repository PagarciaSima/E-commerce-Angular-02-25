import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { FileService } from 'src/app/services/file.service';
import { ProductService } from 'src/app/services/product.service';
import { saveAs } from 'file-saver'; // Importa file-saver


import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

/**
 * Component for displaying a paginated list of products, allowing actions such as 
 * deletion, editing, image preview, and exporting product data in different formats.
 */
@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit{

   /** List of products displayed in the component. */
   public products: Product[] = [];

   /** Controls the visibility of the image modal. */
   public showImageModal: boolean = false;
 
   /** Stores the selected product images for preview. */
   public selectedImages: string[] = [];
 
   /** Current page index for pagination. */
   currentPage: number = 0;
 
   /** Total number of pages available. */
   totalPages: number = 0;
 
   /** Total number of products available. */
   totalElements: number = 0;
 
   /** Number of products per page. */
   pageSize: number = 10;
 
   /** Array of page numbers used for pagination controls. */
   pages: number[] = [];
 
   /** Search query entered by the user. */
   searchKey: string = ''; 
 
   /** Flag indicating whether a file is being generated. */
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

  /**
   * Fetches paginated products from the backend.
   * @param page The current page index.
   * @param size The number of products per page.
   */
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

  /**
   * Changes the current page.
   * @param page The target page index.
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllProductsPaginated(page, this.pageSize);
    }
  }

  /**
   * Retrieves the range of visible pages for pagination.
   * @returns An array of visible page numbers.
   */
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
  

  /**
   * Deletes a product after confirming with the user.
   * @param productId The ID of the product to be deleted.
   */
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

  /**
   * Navigates to the product edit page.
   * @param productId The ID of the product to edit.
   */
  editProductDetails(productId: number) {
    this.router.navigate(['/editProduct', productId]);
  }

  /**
   * Displays images of a selected product.
   * @param product The product whose images will be displayed.
   */
  public viewImages(product: Product) {
    if (!product.productImages || product.productImages.length === 0) {
      this.toastrService.warning('No images available for this product', 'Warning');
      return;
    }
  
    // Construir la URL completa de las imágenes
    this.selectedImages = product.productImages.map(img => `data:${img.type};base64,${img.picByte}`); 
    this.showImageModal = true;
  }
  
  /** Generates and downloads a PDF file of the product list. */
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

 /** Generates and downloads a CSV file of the product list. */
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

   /** Generates and downloads an Excel file of the product list. */
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

  /**
   * Searches for products based on the user's input.
   * @param searchKey The search keyword.
   */
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
