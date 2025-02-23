import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { FileService } from 'src/app/services/file.service';
import { ProductService } from 'src/app/services/product.service';
import { saveAs } from 'file-saver'; // Importa file-saver


import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit{

  public products: Product[] = [];
  public showImageModal: boolean = false;
  public selectedImages: string[] = [];

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private router: Router,
    private fileService: FileService
  ) {

  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      }, error: (error) => {
        console.error('Error retrieving products:', error); 
        const errorMessage = error?.error?.message || 'An unexpected error occurred.';
        this.toastrService.error(`Error while retrieving product list: ${errorMessage}`, 'Error');
      }
    })
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
            this.getAllProducts();
          }, error: (error) => {
            console.log('Error, could not delete the product:', error);
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
    this.fileService.getPdf().subscribe({
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
}
