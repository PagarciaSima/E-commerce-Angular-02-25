import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interfaces/product';
import { OrderDetailsModel } from '../interfaces/order-details-model';
import { Cart } from '../interfaces/cart';
import { MyOrderDetails } from '../interfaces/my-order-details';

/**
 * Service for managing products, orders, and cart-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

   /** Base API URL */
  apiURL: string = environment.apiURL;
  
  /**
   * Constructor
   * @param httpClient HTTP client for making API requests.
   */
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Adds a new product.
   * @param formData The product data as a FormData object.
   * @returns An observable with the created product.
   */
  addProduct(formData: FormData): Observable<Product> {
    // Enviar el FormData al backend
    return this.httpClient.post<Product>(`${this.apiURL}/products/product`, formData);
  }
  
   /**
   * Updates an existing product.
   * @param productId The ID of the product to update.
   * @param formData The updated product data as FormData.
   * @returns An observable indicating the result of the update.
   */
  updateProduct(productId: number, formData: FormData): Observable<any> {
    return this.httpClient.put<any>(`${this.apiURL}/products/product/${productId}`, formData);
  }

  /**
   * Retrieves paginated products.
   * @param page The page number.
   * @param size The number of items per page.
   * @returns An observable with the paginated product list.
   */
  public getAllProductsPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/products`, { params });
  }

  /**
   * Retrieves all products.
   * @returns An observable with a list of all products.
   */
  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}/products/all`);
  }

  /**
   * Deletes a product by ID.
   * @param productId The ID of the product to delete.
   * @returns An observable indicating the deletion result.
   */
  deleteProduct(productId: number): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiURL}/products/product/${productId}`);
  }

   /**
   * Retrieves a product by ID.
   * @param productId The ID of the product.
   * @returns An observable with the product details.
   */
  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiURL}/products/product/${productId}`);
  }

  /**
   * Retrieves images for a specific product.
   * @param productId The ID of the product.
   * @returns An observable with an array of images in base64 format.
   */
  public getProductImages(productId: number): Observable<{ name: string, base64: string }[]> {
    const url = `${this.apiURL}/products/product/${productId}/images`;
    return this.httpClient.get<{ name: string, base64: string }[]>(url);
  }

   /**
   * Retrieves product details for checkout.
   * @param isSingleProductCheckout Whether it's a single product checkout.
   * @param productId The product ID.
   * @returns An observable with product details.
   */
  public getProductDetails(isSingleProductCheckout: boolean, productId: number): Observable<Product[]> {
    const url = `${this.apiURL}/products/getProductDetails?isSingleProductCheckout=${isSingleProductCheckout}&productId=${productId}`;
    return this.httpClient.get<Product[]>(url);
  }

    /**
   * Places an order.
   * @param orderDetails The details of the order.
   * @returns An observable with the order details.
   */
  public placeOrder(orderDetails: OrderDetailsModel): Observable<MyOrderDetails[]> {
    return this.httpClient.post<MyOrderDetails[]>(`${this.apiURL}/order/placeOrder`, orderDetails);
  }

  /**
   * Retrieves the current user's orders.
   * @returns An observable with the order details.
   */
  public getMyOrders(): Observable<MyOrderDetails []> {
    return this.httpClient.get<MyOrderDetails []>(`${this.apiURL}/order/getOrderDetails`);
  }

  /**
   * Retrieves paginated orders for the current user.
   * @param page The page number.
   * @param size The number of items per page.
   * @returns An observable with the paginated order details.
   */
  public getMyOrdersPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getMyOrderDetailsPaginated`, { params });
  }

  /**
   * Searches for orders based on a search term.
   * @param searchTerm The search keyword.
   * @param page The page number.
   * @param size The number of items per page.
   * @returns An observable with the search results.
   */
  public searchMyOrders(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getMyOrderDetailsPaginated`, { params });
  }

  /**
   * Retrieves paginated orders with a specific status.
   * @param page The page number.
   * @param size The number of items per page.
   * @param status The order status.
   * @returns An observable with paginated orders.
   */
  public getAllOrdersPaginated(page: number, size: number , status: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getAllOrderDetailsPaginated/${status}`, { params });
  }

    /**
   * Searches for all orders based on a given search term and returns paginated results.
   * @param searchTerm The term used to search for orders.
   * @param page The page number for pagination.
   * @param size The number of items per page.
   * @returns An observable containing the paginated search results.
   */
  public searchAllOrders(status: string, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/order/getAllOrderDetailsPaginated/${status}`, { params });
  }

  /**
   * Updates an order's status.
   * @param orderId The order ID.
   * @param newStatus The new status to apply.
   * @returns An observable indicating the update result.
   */
  public changeStatus(orderId: number, newStatus: string): Observable<any> {
    const body = { status: newStatus };
    return this.httpClient.patch<any>(`${this.apiURL}/order/markOrderAsDelivered/${orderId}`, body);
  }
  
  /**
   * Searches for products based on a search term.
   * @param searchTerm The search keyword.
   * @param page The page number.
   * @param size The number of items per page.
   * @returns An observable with the search results.
   */
  public searchProducts(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  // Search term
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/products`, { params });
  }

   /**
   * Adds a product to the shopping cart.
   * @param productId The product ID.
   * @returns An observable with the updated cart.
   */
  public addToCart(productId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.apiURL}/cart/addToCart/${productId}`, null);
  }
  
  /**
   * Retrieves the user's shopping cart details.
   * @returns An observable with cart items.
   */
  public getCartDetails(): Observable<Cart[]> {
    return this.httpClient.get<Cart[]>(`${this.apiURL}/cart/cartDetails`);
  }

  /**
   * Retrieves paginated details of the shopping cart.
   * @param page The page number for pagination.
   * @param size The number of items per page.
   * @returns An observable containing the paginated cart details.
   */
  public getCartDetailsPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/cart/cartDetails/paginated`, { params });
  }

  /**
   * Searches for cart details based on a given search term and returns paginated results.
   * @param searchTerm The term used to search for cart items.
   * @param page The page number for pagination.
   * @param size The number of items per page.
   * @returns An observable containing the paginated search results for cart items.
   */
  public searchCartDetails(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchKey', searchTerm)  // Search term
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.httpClient.get<any>(`${this.apiURL}/cart/cartDetails/paginated`, { params });
  }

  /**
   * Clears the shopping cart.
   * @returns An observable indicating the operation result.
   */
  public clearCart(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/cart/clearCart`);
  }

  /**
   * Deletes a specific cart item by ID.
   * @param cartId The ID of the cart item to delete.
   * @returns An observable indicating the deletion result.
   */
  public deleteCartById(cartId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/cart/deleteCartItem/${cartId}`);
  }

  
}
