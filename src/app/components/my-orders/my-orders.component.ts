import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit{

  myOrderDetails: MyOrderDetails[] = [];

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getMyOrders()
  }

  getMyOrders() {
    this.productService.getMyOrders().subscribe({
      next: (data) => {
        this.myOrderDetails = data;
      }, error: (error) => {
        this.toastrService.error('Error while retrieving order details ' + error.error, 'Error');
      }
    });
  }
}
