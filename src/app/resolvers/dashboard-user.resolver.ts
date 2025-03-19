import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { forkJoin } from 'rxjs';
import { OrderAndProductDto } from '../interfaces/order-and-product-dto';
import { SalesData } from '../interfaces/sales-data';

export const dashboardUserResolver: ResolveFn<{
  last4Orders: OrderAndProductDto[];
  salesData: SalesData;
  ordersData: SalesData;
}> = (route, state) => {
  const dashboardService = inject(DashboardService); // Inyecta el servicio

  // Usa forkJoin para realizar las llamadas en paralelo
  return forkJoin({
    last4Orders: dashboardService.getLastFourOrders(),
    salesData: dashboardService.getSalesPerMonth(),
    ordersData: dashboardService.getOrdersByOrderStatus(),
  });
};