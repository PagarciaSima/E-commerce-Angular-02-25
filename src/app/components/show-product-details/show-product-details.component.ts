import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

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
    private router: Router
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
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastrService.success(`Product deleted successfully`, 'Success');
        this.getAllProducts();
      }, error: (error) => {
        console.log('Error, could not delete the product:', error); 
        const errorMessage = error?.error?.message || 'An unexpected error occurred.';
        this.toastrService.error(`Error while deleting the product: ${errorMessage}`, 'Error');
      }
    })
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
  
}
