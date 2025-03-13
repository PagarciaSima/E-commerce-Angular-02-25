import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DataPayment } from '../interfaces/data-payment';
import { UrlPaypalResponse } from '../interfaces/url-paypal-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient,
  ) { }

  getURLPaypalPayment(dataPayment: DataPayment): Observable<UrlPaypalResponse> {
    return this.httpClient.post<UrlPaypalResponse>(`${this.apiURL}/payments`, dataPayment);
  }
}
