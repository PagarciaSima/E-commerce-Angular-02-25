import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesData } from '../interfaces/sales-data';
import { environment } from 'src/environments/environment.development';
import { OrderAndProductDto } from '../interfaces/order-and-product-dto';
import { TopSelling } from '../interfaces/top-selling';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getSalesPerMonth(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/sales-per-month`);
  }

  getOrdersByOrderStatus(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/orders-by-status`);
  }

  getLastFourOrders(): Observable<OrderAndProductDto[]> {
    return this.http.get<OrderAndProductDto[]>(`${this.apiURL}/dashboard/last-four`);
  }

  getSalesPerMonthAdmin(): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.apiURL}/dashboard/sales-per-month-admin`);
  }

  getTopSellingProducts(): Observable<TopSelling[]> {
    return this.http.get<TopSelling[]>(`${this.apiURL}/dashboard/top-selling`);
  }
}
