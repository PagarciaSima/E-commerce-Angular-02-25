import { Component, OnInit } from '@angular/core';
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

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
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
}
