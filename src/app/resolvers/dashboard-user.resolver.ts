import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { forkJoin } from 'rxjs';
import { OrderAndProductDto } from '../interfaces/order-and-product-dto';
import { SalesData } from '../interfaces/sales-data';

/**
 * Resolver for fetching dashboard data before navigating to the user dashboard page.
 * It retrieves the last four orders, sales data per month, and order status data.
 */
export const dashboardUserResolver: ResolveFn<{
  last4Orders: OrderAndProductDto[];
  salesData: SalesData;
  ordersData: SalesData;
}> = (route, state) => {
  const dashboardService = inject(DashboardService); // Inyecta el servicio

 
  /**
   * Calls the dashboard service to fetch required data.
   * Uses `forkJoin` to perform multiple API calls in parallel.
   */
  return forkJoin({
    last4Orders: dashboardService.getLastFourOrders(),
    salesData: dashboardService.getSalesPerMonth(),
    ordersData: dashboardService.getOrdersByOrderStatus(),
  });
};