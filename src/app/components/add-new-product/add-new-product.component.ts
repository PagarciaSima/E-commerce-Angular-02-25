import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent {

  product: Product = {
    productName: '',
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0
  }

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  addProduct() {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.toastrService.success('Product created successfully', 'Success');
      }, error: (err) => {
        this.toastrService.error('Error occurred while creating product: ' + err.error, 'Error');
      }
    })
  }

  clearForm(productForm: NgForm) {
    productForm.resetForm();  
    this.product = {          
      productName: '',
      productDescription: '',
      productActualPrice: 0,
      productDiscountedPrice: 0
    };
  }
}
