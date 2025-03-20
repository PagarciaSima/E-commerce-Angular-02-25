import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesData } from '../interfaces/sales-data';
import { environment } from 'src/environments/environment.development';
import { OrderAndProductDto } from '../interfaces/order-and-product-dto';
import { TopSelling } from '../interfaces/top-selling';

/**
 * Service for retrieving dashboard data related to sales and orders.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves sales data grouped by month.
   * @returns An `Observable` containing sales data per month.
   */
  getSalesPerMonth(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/sales-per-month`);
  }

   /**
   * Retrieves the number of orders grouped by order status.
   * @returns An `Observable` containing order count by status.
   */
  getOrdersByOrderStatus(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/orders-by-status`);
  }

  /**
   * Retrieves the last four orders placed.
   * @returns An `Observable` containing an array of the last four orders.
   */
  getLastFourOrders(): Observable<OrderAndProductDto[]> {
    return this.http.get<OrderAndProductDto[]>(`${this.apiURL}/dashboard/last-four`);
  }

  /**
   * Retrieves sales data grouped by month for admin users.
   * @returns An `Observable` containing sales data per month (admin).
   */
  getSalesPerMonthAdmin(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/sales-per-month-admin`);
  }

  /**
   * Retrieves the top five best-selling products.
   * @returns An `Observable` containing an array of the top-selling products.
   */
  getTopSellingProducts(): Observable<TopSelling[]> {
    return this.http.get<TopSelling[]>(`${this.apiURL}/dashboard/top-selling`);
  }
}
