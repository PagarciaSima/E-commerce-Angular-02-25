import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataPayment } from '../interfaces/data-payment';
import { UrlPaypalResponse } from '../interfaces/url-paypal-response';
import { Observable } from 'rxjs';

/**
 * Service for handling payment-related operations, such as initiating a PayPal payment.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  /** Base API URL */
  apiURL: string = environment.apiURL;
  
   /**
   * Service constructor.
   * @param httpClient HTTP client for making API requests.
   */
  constructor(
    private httpClient: HttpClient,
  ) { }

   /**
   * Initiates a PayPal payment and retrieves the payment URL.
   * @param dataPayment The payment details required for the transaction.
   * @returns An `Observable` containing the PayPal payment URL response.
   */
  getURLPaypalPayment(dataPayment: DataPayment): Observable<UrlPaypalResponse> {
    return this.httpClient.post<UrlPaypalResponse>(`${this.apiURL}/payments`, dataPayment);
  }
}
