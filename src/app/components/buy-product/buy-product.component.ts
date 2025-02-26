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

  getQuantityForProduct(productId: number): number {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId: number, productPrice: number): number {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity * productPrice;
  }

  onQuantityChanged(quantity: number, productId: number) {
    console.log(quantity)
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = quantity;
  }

  getCalculatedGrandTotal(): number {
    let grandTotal = 0;
  
    this.orderDetails.orderProductQuantityList.forEach((productQuantity) => {
      const product = this.productDetails.find(product => product.productId === productQuantity.productId);
  
      if (product) {
        const price = product.productDiscountedPrice > 0 ? product.productDiscountedPrice : product.productActualPrice;
        grandTotal += price * productQuantity.quantity; // Multiplicamos por la cantidad seleccionada
      }
    });
  
    return grandTotal;
  }
  
}
