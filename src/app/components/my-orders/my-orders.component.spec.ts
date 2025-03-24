import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MyOrdersComponent } from './my-orders.component';
import { ProductService } from 'src/app/services/product.service';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockOrderResponse = {
    content: [
      {
        orderId: 1,
        orderFullName: 'Order full name',
        orderFullOrder: 'Address',
        orderContactNumber: '123456789',
        orderAlternateContactNumber: '123456789',
        orderStatus: 'Delivered',
        orderAmount: 3,
        product: {
          productId: 1,
          productName: 'My product',
          productDescription: 'desc',
          productDiscountedPrice: 100,
          productActualPrice: 200,
        },
        user: {
          userName: 'Me',
          userFirstName: 'userFirstName',
          userLastName: 'userLastName',
          userPassword: '12345',
          role: [{
            roleName: 'RoleAdmin',
            roleDescription: 'Admin role',
          }],
        },
      },
    ] as MyOrderDetails[],
    totalPages: 2,
    totalElements: 4,
    pageSize: 2,
  };

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['error']);
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getMyOrdersPaginated',
      'searchMyOrders',
    ]);

    await TestBed.configureTestingModule({
      declarations: [MyOrdersComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch orders on ngOnInit', () => {
    mockProductService.getMyOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.ngOnInit();

    expect(mockProductService.getMyOrdersPaginated).toHaveBeenCalledWith(0, 8);
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
    expect(component.totalPages).toBe(mockOrderResponse.totalPages);
    expect(component.totalElements).toBe(mockOrderResponse.totalElements);
    expect(component.pageSize).toBe(mockOrderResponse.pageSize);
    expect(component.pages).toEqual([0, 1]);
  });

  it('should handle error when fetching orders', () => {
    const errorResponse = { status: 500, error: 'Server Error' };
    mockProductService.getMyOrdersPaginated.and.returnValue(throwError(errorResponse));

    component.ngOnInit();

    expect(mockProductService.getMyOrdersPaginated).toHaveBeenCalledWith(0, 8);
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Translated messageServer Error',
      'Error'
    );
  });

  it('should change page and fetch orders', () => {
    mockProductService.getMyOrdersPaginated.and.returnValue(of(mockOrderResponse));

    // Simula que el componente ya tiene datos iniciales
    component.totalPages = 2; // Asegúrate de que totalPages esté configurado
    component.changePage(1);

    expect(component.currentPage).toBe(1); // Verifica que currentPage se actualice
    expect(mockProductService.getMyOrdersPaginated).toHaveBeenCalledWith(1, 8); // Verifica la llamada al servicio
  });

  it('should not change page if page is out of bounds', () => {
    component.currentPage = 0;
    component.totalPages = 2;

    component.changePage(-1); // Intenta cambiar a una página inválida
    expect(component.currentPage).toBe(0); // No cambia

    component.changePage(3); // Intenta cambiar a una página inválida
    expect(component.currentPage).toBe(0); // No cambia
  });

  it('should get visible pages for pagination', () => {
    component.currentPage = 2;
    component.totalPages = 5;

    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
  });

  it('should search orders when search key is provided', () => {
    const searchKey = 'test';
    mockProductService.searchMyOrders.and.returnValue(of(mockOrderResponse));

    component.searchOrderDetails(searchKey);

    expect(component.searchKey).toBe(searchKey);
    expect(mockProductService.searchMyOrders).toHaveBeenCalledWith(searchKey, 0, 8);
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
    expect(component.totalPages).toBe(mockOrderResponse.totalPages);
    expect(component.totalElements).toBe(mockOrderResponse.totalElements);
    expect(component.pageSize).toBe(mockOrderResponse.pageSize);
    expect(component.pages).toEqual([0, 1]);
  });

  it('should fetch all orders when search key is empty', () => {
    const searchKey = '';
    mockProductService.getMyOrdersPaginated.and.returnValue(of(mockOrderResponse));

    component.searchOrderDetails(searchKey);

    expect(component.searchKey).toBe(searchKey);
    expect(mockProductService.getMyOrdersPaginated).toHaveBeenCalledWith(0, 8);
    expect(component.myOrderDetails).toEqual(mockOrderResponse.content);
  });

  it('should handle error when searching orders', () => {
    const searchKey = 'test';
    const errorResponse = { status: 500, error: 'Server Error' };
    mockProductService.searchMyOrders.and.returnValue(throwError(errorResponse));

    component.searchOrderDetails(searchKey);

    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Translated messageServer Error', // Asegúrate de que haya un espacio
      'Error'
    );
  });
});