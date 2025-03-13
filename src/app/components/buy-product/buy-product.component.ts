import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { Product } from 'src/app/interfaces/product';  // Importar el modelo de producto
import { PaymentService } from 'src/app/services/payment.service';
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

  isGeneratingFile: boolean = false;

  productDetails: Product[] = [];  // Lista de productos obtenidos del resolver

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private paymentService: PaymentService
  
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
    this.isGeneratingFile = true;
    localStorage.setItem('pendingOrder', JSON.stringify(this.orderDetails));
    this.processPayment().subscribe({
      next: (paymentUrl: string) => {
        this.isGeneratingFile = false;

        if (paymentUrl) {
          orderForm.reset();
          console.log('Cart cleared successfully.');
          window.location.href = paymentUrl; // Redirigir al usuario a PayPal
        } else {
          this.toastrService.error('Error while processing the payment', 'Error');
        }
      },
      error: (err) => {
        this.isGeneratingFile = false;
        console.error('Error occurred:', err);
        this.toastrService.error('Error while processing the payment', 'Error');
      }
    });
  }
  
  private processPayment(): Observable<string> {
    const dataPayment = {
      method: 'PAYPAL',
      amount: this.getCalculatedGrandTotal().toString(),
      currency: 'EUR',
      description: `Payment processed`
    };
  
    return this.paymentService.getURLPaypalPayment(dataPayment).pipe(
      switchMap(paymentResponse => {
        if (paymentResponse?.url) {
          return of(paymentResponse.url.toString());
        }
        return throwError(() => new Error('Invalid payment response'));
      }),
      catchError(() => {
        this.toastrService.error('The payment could not be processed.', 'Payment Error');
        return of('');
      })
    );
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
