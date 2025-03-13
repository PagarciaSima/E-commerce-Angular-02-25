import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit{

   orderDetails: OrderDetailsModel = {
      fullName: '',
      fullAddress: '',
      contactNumber: '',
      alternateContactNumber: '',
      orderProductQuantityList: []
  };
  
  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    const orderData = localStorage.getItem('pendingOrder');
    if (orderData) {
      this.orderDetails = JSON.parse(orderData);
      this.createOrder();
    }
  }
  
  private createOrder() {
    this.productService.placeOrder(this.orderDetails).subscribe({
      next: () => {
        this.toastrService.success('Order placed successfully', 'Success');
        localStorage.removeItem('pendingOrder'); // Eliminamos la orden almacenada
      },
      error: () => {
        this.toastrService.error('Error placing order', 'Error');
      }
    });
  }
}
