import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/interfaces/cart';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  cartDetails: Cart[] = [];

  constructor(
    private toastrService: ToastrService,
    private productService: ProductService
  ) {
    
  }

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails() {
    this.productService.getCartDetails().subscribe({
      next: (data) => {
        this.cartDetails = data;
      },
      error: (error) => {
        this.toastrService.error('Could not retrieve cart details ' + error.error, 'Error')
      }
    });
  }
}
