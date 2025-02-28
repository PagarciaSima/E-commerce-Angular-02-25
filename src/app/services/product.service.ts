import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interfaces/product';
import { OrderDetailsModel } from '../interfaces/order-details-model';
import { Cart } from '../interfaces/cart';

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

  public getAllProductsPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/products`, { params });
  }

  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}/products/all`);
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

  public getProductDetails(isSingleProductCheckout: boolean, productId: number): Observable<Product[]> {
    const url = `${this.apiURL}/products/getProductDetails?isSingleProductCheckout=${isSingleProductCheckout}&productId=${productId}`;
    return this.httpClient.get<Product[]>(url);
  }

  public placeOrder(orderDetails: OrderDetailsModel): Observable<void> {
    return this.httpClient.post<void>(`${this.apiURL}/placeOrder`, orderDetails);
  }

  // Método para buscar productos
  public searchProducts(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  // Agregar el término de búsqueda
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/products`, { params });
  }

  public addToCart(productId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.apiURL}/addToCart/${productId}`, null);
  }
  
  
}
