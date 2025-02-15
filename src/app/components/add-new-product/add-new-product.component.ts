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

  selectedFiles: File[] = [];

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
        console.log(err)
        this.toastrService.error('Error occurred while creating product: ' + err.error, 'Error');
      }
    })
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    const files = Array.from(input.files);
  
    if (this.selectedFiles.length + files.length > 3) {
      this.toastrService.warning('You can only upload up to 3 images.', 'Warning');
      return;
    }
  
    this.selectedFiles.push(...files);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
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
