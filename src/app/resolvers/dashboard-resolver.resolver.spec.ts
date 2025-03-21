import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { dashboardAdminResolver } from './dashboard-admin.resolver';
import { DashboardService } from '../services/dashboard.service';
import { of } from 'rxjs';

describe('dashboardAdminResolver', () => {
  const executeResolver: ResolveFn<{
    salesData: any;
    ordersData: any;
    topSelling: any[];
  }> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => dashboardAdminResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getOrdersByOrderStatus: () => of({}), // Simula la respuesta del servicio
            getSalesPerMonthAdmin: () => of({}),  // Simula la respuesta del servicio
            getTopSellingProducts: () => of([]), // Simula la respuesta del servicio
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});