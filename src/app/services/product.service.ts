import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interfaces/product';
import { OrderDetailsModel } from '../interfaces/order-details-model';
import { Cart } from '../interfaces/cart';
import { MyOrderDetails } from '../interfaces/my-order-details';

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

  public placeOrder(orderDetails: OrderDetailsModel): Observable<MyOrderDetails[]> {
    return this.httpClient.post<MyOrderDetails[]>(`${this.apiURL}/order/placeOrder`, orderDetails);
  }

  public getMyOrders(): Observable<MyOrderDetails []> {
    return this.httpClient.get<MyOrderDetails []>(`${this.apiURL}/order/getOrderDetails`);
  }

  public getMyOrdersPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getMyOrderDetailsPaginated`, { params });
  }

  public searchMyOrders(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getMyOrderDetailsPaginated`, { params });
  }

  public getAllOrdersPaginated(page: number, size: number , status: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getAllOrderDetailsPaginated/${status}`, { params });
  }

  public searchAllOrders(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getAllOrderDetailsPaginated`, { params });
  }

  public changeStatus(orderId: number, newStatus: string): Observable<any> {
    const body = { status: newStatus };
    return this.httpClient.patch<any>(`${this.apiURL}/order/markOrderAsDelivered/${orderId}`, body);
  }
  
  // Método para buscar productos
  public searchProducts(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  // Search term
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/products`, { params });
  }

  public addToCart(productId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.apiURL}/cart/addToCart/${productId}`, null);
  }
  
  public getCartDetails(): Observable<Cart[]> {
    return this.httpClient.get<Cart[]>(`${this.apiURL}/cart/cartDetails`);
  }

  public getCartDetailsPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/cart/cartDetails/paginated`, { params });
  }

  public searchCartDetails(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  // Search term
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/cart/cartDetails/paginated`, { params });
  }

  public clearCart(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/cart/clearCart`);
  }

  public deleteCartById(cartId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/cart/deleteCartItem/${cartId}`);
  }

  
}
