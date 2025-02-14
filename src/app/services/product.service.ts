import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.apiURL}/product`, product);
  }
}
