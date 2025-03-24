import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { of, throwError } from 'rxjs';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockOrderResponse = {
    content: [
      {
        orderId: 1,
        orderFullName: 'John Doe',
        orderFullOrder: '123 Main St',
        orderContactNumber: '123456789',
        orderAlternateContactNumber: '987654321',
        orderStatus: 'Delivered',
        orderAmount: 100,
        product: {
          productId: 1,
          productName: 'Product 1',
          productDescription: 'Description 1',
          productDiscountedPrice: 90,
          productActualPrice: 100,
        },
        user: {
          userName: 'johndoe',
          userFirstName: 'John',
          userLastName: 'Doe',
          userPassword: 'password',
          role: [
            {
              roleName: 'User',
              roleDescription: 'Regular user',
            },
          ],
        },
      },
    ],
    totalPages: 2,
    totalElements: 4,
    pageSize: 8,
  };

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getAllOrdersPaginated',
      'searchAllOrders',
      'changeStatus',
    ]);

    await TestBed.configureTestingModule({
      declarations: [OrdersComponent],
      imports: [TranslateModule.forRoot()], // Importa TranslateModule
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch orders on ngOnInit', () => {
    mockProductService.getAllOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.ngOnInit();

    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(0, 8, 'all');
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
    expect(component.totalPages).toBe(mockOrderResponse.totalPages);
    expect(component.totalElements).toBe(mockOrderResponse.totalElements);
    expect(component.pageSize).toBe(mockOrderResponse.pageSize);
    expect(component.pages).toEqual([0, 1]);
  });

  it('should change page and fetch orders', () => {
    mockProductService.getAllOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.totalPages = 2; // Asegúrate de que totalPages esté configurado
    component.changePage(1);

    expect(component.currentPage).toBe(1);
    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(1, 8, 'all');
  });

  it('should search orders when search key is provided', () => {
    const searchKey = 'test';
    mockProductService.searchAllOrders.and.returnValue(of(mockOrderResponse));

    component.searchOrderDetails(searchKey);

    expect(component.searchKey).toBe(searchKey);
    expect(mockProductService.searchAllOrders).toHaveBeenCalledWith('all', searchKey, 0, 8);
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
    expect(component.totalPages).toBe(mockOrderResponse.totalPages);
    expect(component.totalElements).toBe(mockOrderResponse.totalElements);
    expect(component.pageSize).toBe(mockOrderResponse.pageSize);
    expect(component.pages).toEqual([0, 1]);
  });

  it('should fetch all orders when search key is empty', () => {
    const searchKey = '';
    mockProductService.getAllOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.searchOrderDetails(searchKey);

    expect(component.searchKey).toBe(searchKey);
    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(0, 8, 'all');
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
  });

  it('should change status and reload orders', () => {
    const orderId = 1;
    const newStatus = 'Shipped';
    mockProductService.changeStatus.and.returnValue(of({}));
    mockProductService.getAllOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.changeStatus(orderId, newStatus);

    expect(mockProductService.changeStatus).toHaveBeenCalledWith(orderId, newStatus);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(0, 8, 'all');
  });

  it('should filter orders by status', () => {
    const status = 'Shipped';
    mockProductService.getAllOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.filterOrders(status);

    expect(component.orderStatus).toBe(status);
    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(0, 8, status);
  });

  it('should handle error when fetching orders', () => {
    const errorResponse = { status: 500, error: 'Server Error' };
    mockProductService.getAllOrdersPaginated.and.returnValue(throwError(errorResponse));

    component.ngOnInit();

    expect(mockProductService.getAllOrdersPaginated).toHaveBeenCalledWith(0, 8, 'all');
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Translated messageServer Error',
      'Error'
    );
  });

  it('should handle error when searching orders', () => {
    const searchKey = 'test';
    const errorResponse = { status: 500, error: 'Server Error' };
    mockProductService.searchAllOrders.and.returnValue(throwError(errorResponse));

    component.searchOrderDetails(searchKey);

    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Translated messageServer Error',
      'Error'
    );
  });

  it('should handle error when changing status', () => {
    const orderId = 1;
    const newStatus = 'Shipped';
    const errorResponse = { status: 500, error: { message: 'Server Error' } };
    mockProductService.changeStatus.and.returnValue(throwError(errorResponse));

    component.changeStatus(orderId, newStatus);

    expect(mockProductService.changeStatus).toHaveBeenCalledWith(orderId, newStatus);
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Translated messageServer Error',
      'Error'
    );
  });
});