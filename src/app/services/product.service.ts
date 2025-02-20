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

  addProduct(formData: FormData): Observable<Product> {
    // Enviar el FormData al backend
    return this.httpClient.post<Product>(`${this.apiURL}/products/product`, formData);
  }
  
  updateProduct(productId: number, formData: FormData): Observable<any> {
    return this.httpClient.put<any>(`${this.apiURL}/products/product/${productId}`, formData);
  }

  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}/products`);
  }

  deleteProduct(productId: number): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiURL}/products/product/${productId}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiURL}/products/product/${productId}`);
  }

  public getProductImages(productId: number): Observable<{ name: string, base64: string }[]> {
    const url = `${this.apiURL}/products/product/${productId}/images`;
    return this.httpClient.get<{ name: string, base64: string }[]>(url);
  }


  
  
}
