import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { Product } from 'src/app/interfaces/product';  // Importar el modelo de producto
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  orderDetails: OrderDetailsModel = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: []
  };

  productDetails: Product[] = [];  // Lista de productos obtenidos del resolver

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private toastrService: ToastrService
  
  ) { }

  ngOnInit(): void {
    // Obtener los datos del resolver
    this.activatedRoute.data.subscribe((data) => {
      if (data['productDetails']) {
        this.productDetails = data['productDetails']; 
      }
    });

    this.productDetails.forEach(
      product => this.orderDetails.orderProductQuantityList.push(
        {
          productId: product.productId!,
          quantity: 1
        }
      )
    );

  }

  placeOrder(orderForm: NgForm) {
    console.log(this.orderDetails)
    this.productService.placeOrder(this.orderDetails).subscribe({
      next: (data) => {
        orderForm.reset();
      }, error: (err) => {
        this.toastrService.error('Error while creating the order', 'Error');
      }
    });
  }
}
