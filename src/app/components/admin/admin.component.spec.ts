import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ActivatedRoute } from '@angular/router';
import { SalesData } from 'src/app/interfaces/sales-data';
import { TopSelling } from 'src/app/interfaces/top-selling';
import { NgChartsModule } from 'ng2-charts'; // Importa el módulo de Chart.js

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  // Datos de prueba para simular el resolver
  const mockSalesData: SalesData = {
    labels: ['January', 'February'],
    values: [100, 200]
  };

  const mockOrdersData: SalesData = {
    labels: ['Pending', 'Completed'],
    values: [5, 10]
  };

  const mockTopSelling: TopSelling[] = [
    { productId: 1, productName: 'Product A', totalSales: 30 },
    { productId: 2, productName: 'Product B', totalSales: 50 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [NgChartsModule], // Importa el módulo de Chart.js
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                dashboardData: {
                  salesData: mockSalesData,
                  ordersData: mockOrdersData,
                  topSelling: mockTopSelling
                }
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from resolver', () => {
    expect(component.salesData).toEqual(mockSalesData);
    expect(component.ordersData).toEqual(mockOrdersData);
    expect(component.topSelling).toEqual(mockTopSelling);
  });
});