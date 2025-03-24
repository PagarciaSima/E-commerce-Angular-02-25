import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { ActivatedRoute } from '@angular/router';
import { SalesData } from 'src/app/interfaces/sales-data';
import { OrderAndProductDto } from 'src/app/interfaces/order-and-product-dto';
import { NgChartsModule } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  // Datos de prueba para simular el resolver
  const mockSalesData: SalesData = {
    labels: ['January', 'February', 'March'],
    values: [150, 220, 180]
  };

  const mockOrdersData: SalesData = {
    labels: ['Processing', 'Shipped', 'Delivered'],
    values: [3, 5, 8]
  };

  const mockLast4Orders: OrderAndProductDto[] = [
    { 
      orderId: 1, 
      orderDate: '2025-03-24', // Formato ISO 8601
      orderStatus: 'Delivered',
      productName: 'Product X',
      productActualPrice: 29.99,
      productDiscountedPrice: 25
    },
    { 
      orderId: 2, 
      orderDate: '2025-03-24', // Formato ISO 8601
      orderStatus: 'Delivered',
      productName: 'Product y',
      productActualPrice: 23.99,
      productDiscountedPrice: 22
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [NgChartsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                dashboardData: {
                  salesData: mockSalesData,
                  ordersData: mockOrdersData,
                  last4Orders: mockLast4Orders
                }
              }
            }
          }
        },
        DatePipe // Añadimos el DatePipe a los providers
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from resolver', () => {
    // Usamos jasmine.objectContaining porque el DatePipe puede modificar los datos
    expect(component.salesData).toEqual(mockSalesData);
    expect(component.ordersData).toEqual(mockOrdersData);
    expect(component.last4Orders).toEqual(mockLast4Orders);
  });

  it('should setup sales chart data correctly', () => {
    expect(component.chartDataSalesPerMonth.labels).toEqual(mockSalesData.labels);
    expect(component.chartDataSalesPerMonth.datasets.length).toBe(1);
    expect(component.chartDataSalesPerMonth.datasets[0].data).toEqual(mockSalesData.values);
    expect(component.chartDataSalesPerMonth.datasets[0].label).toBe('Orders per Month');
  });

  it('should setup orders by status chart data correctly', () => {
    expect(component.chartDataOrdersByStatus.labels).toEqual(mockOrdersData.labels);
    expect(component.chartDataOrdersByStatus.datasets.length).toBe(1);
    expect(component.chartDataOrdersByStatus.datasets[0].data).toEqual(mockOrdersData.values);
    expect(component.chartDataOrdersByStatus.datasets[0].label).toBe('Orders by status');
  });

  it('should have correct chart options', () => {
    expect(component.chartOptions.responsive).toBeTrue();
    expect(component.chartOptions.plugins?.legend?.display).toBeFalse();
  });
});