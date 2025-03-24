import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component responsible for confirming and placing an order.
 * It retrieves order details from local storage and submits the order upon initialization.
 */
@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit{

  /** Model containing the order details */
   orderDetails: OrderDetailsModel = {
      fullName: '',
      fullAddress: '',
      contactNumber: '',
      alternateContactNumber: '',
      orderProductQuantityList: []
  };
  
  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private translate: TranslateService
    
  ) {

  }

  ngOnInit(): void {
    const orderData = localStorage.getItem('pendingOrder');
    if (orderData) {
      this.orderDetails = JSON.parse(orderData);
      this.createOrder();
    }
  }
  
   /**
   * Sends the order details to the backend to place an order.
   * If successful, it removes the stored order from local storage.
   */
  createOrder() {
    this.productService.placeOrder(this.orderDetails).subscribe({
      next: () => {
        this.toastrService.success(this.translate.instant('Toast.OrderPlaced') , 'Success');
        localStorage.removeItem('pendingOrder'); // Eliminamos la orden almacenada
      },
      error: () => {
        this.toastrService.error(this.translate.instant('Toast.OrderError') , 'Error');
      }
    });
  }
}
