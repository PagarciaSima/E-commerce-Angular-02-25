import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { Product } from 'src/app/interfaces/product';  // Importar el modelo de producto
import { PaymentService } from 'src/app/services/payment.service';

/**
 * Component responsible for handling product purchases.
 * Allows users to enter order details, modify quantities, and process payments via PayPal.
 */
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  /** Order details including user information and product quantities */
  orderDetails: OrderDetailsModel = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: []
  };

  /** Indicates whether the payment process is in progress */
  isGeneratingFile: boolean = false;

  /** List of products obtained from the resolver */
  productDetails: Product[] = [];  

  /**
   * Creates an instance of BuyProductComponent.
   * @param {ActivatedRoute} activatedRoute - Provides access to route data.
   * @param {ToastrService} toastrService - Service for displaying notifications.
   * @param {PaymentService} paymentService - Handles payment processing.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private paymentService: PaymentService,
    private translate: TranslateService
  
  ) { }

  /**
   * Lifecycle hook that runs on component initialization.
   * Retrieves product data from the resolver and initializes order details.
   */
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

  /**
   * Initiates the order placement process and redirects to PayPal if successful.
   * @param {NgForm} orderForm - The form containing order details.
   */
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
          
          this.toastrService.error(this.translate.instant('Toast.ErrorPayment'), 'Error');
        }
      },
      error: (err) => {
        this.isGeneratingFile = false;
        this.toastrService.error(this.translate.instant('Toast.ErrorPayment'), 'Error');
      }
    });
  }
  
  /**
   * Handles payment processing and returns a PayPal URL.
   * @private
   * @returns {Observable<string>} The PayPal payment URL or an empty string in case of error.
   */
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
        this.toastrService.error(this.translate.instant('Toast.ErrorPaymentProcessed'), 'Error');
        return of('');
      })
    );
  }

  /**
   * Retrieves the quantity for a specific product.
   * @param {number} productId - The product ID.
   * @returns {number} The selected quantity.
   */
  getQuantityForProduct(productId: number): number {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity;
  }

   /**
   * Calculates the total price for a specific product.
   * @param {number} productId - The product ID.
   * @param {number} productPrice - The price per unit.
   * @returns {number} The calculated total.
   */
  getCalculatedTotal(productId: number, productPrice: number): number {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity * productPrice;
  }

  /**
   * Updates the selected quantity of a product.
   * @param {number} quantity - The new quantity.
   * @param {number} productId - The product ID.
   */
  onQuantityChanged(quantity: number, productId: number) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = quantity;
  }

  /**
   * Calculates the grand total for all selected products.
   * @returns {number} The total order amount.
   */
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
