import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { forkJoin } from 'rxjs';
import { SalesData } from '../interfaces/sales-data';
import { TopSelling } from '../interfaces/top-selling';


export const dashboardAdminResolver: ResolveFn<{
  salesData: SalesData;
  ordersData: SalesData;
  topSelling: TopSelling[];
}> = (route, state) => {
  const dashboardService = inject(DashboardService); // Inyecta el servicio

  // Usa forkJoin para realizar las llamadas en paralelo
  return forkJoin({
    ordersData: dashboardService.getOrdersByOrderStatus(),
    salesData: dashboardService.getSalesPerMonthAdmin(),
    topSelling: dashboardService.getTopSellingProducts()
  });
};