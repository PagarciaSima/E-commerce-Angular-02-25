import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { of, throwError } from 'rxjs';
import { OrderDetailsModel } from 'src/app/interfaces/order-details-model';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockOrderDetails: OrderDetailsModel = {
    fullName: 'John Doe',
    fullAddress: '123 Main St',
    contactNumber: '123456789',
    alternateContactNumber: '987654321',
    orderProductQuantityList: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  };

  const mockOrderResponse: MyOrderDetails[] = [
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
  ];

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockProductService = jasmine.createSpyObj('ProductService', ['placeOrder']);

    await TestBed.configureTestingModule({
      declarations: [OrderConfirmationComponent],
      imports: [TranslateModule.forRoot()], // Importa TranslateModule
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call createOrder if localStorage has data', () => {
    // Simula que hay datos en localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockOrderDetails));
    mockProductService.placeOrder.and.returnValue(of(mockOrderResponse)); // Configura el comportamiento de placeOrder
    spyOn(localStorage, 'removeItem');

    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('pendingOrder');
    expect(component.orderDetails).toEqual(mockOrderDetails);
    expect(mockProductService.placeOrder).toHaveBeenCalledWith(mockOrderDetails);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
    expect(localStorage.removeItem).toHaveBeenCalledWith('pendingOrder');
  });

  it('should not call placeOrder if localStorage is empty', () => {
    // Simula que no hay datos en localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('pendingOrder');
    expect(mockProductService.placeOrder).not.toHaveBeenCalled();
  });

  it('should handle error when placeOrder fails', () => {
    // Simula que hay datos en localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockOrderDetails));
    mockProductService.placeOrder.and.returnValue(throwError('Error')); // Configura el comportamiento de placeOrder

    component.ngOnInit();

    expect(mockProductService.placeOrder).toHaveBeenCalledWith(mockOrderDetails);
    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });
});