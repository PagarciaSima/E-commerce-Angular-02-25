import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BuyProductComponent } from './buy-product.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslatePipe

import { SpinnerComponent } from '../shared/spinner/spinner.component';

describe('BuyProductComponent', () => {
  let component: BuyProductComponent;
  let fixture: ComponentFixture<BuyProductComponent>;
  let mockPaymentService: jasmine.SpyObj<PaymentService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockPaymentService = jasmine.createSpyObj('PaymentService', ['getURLPaypalPayment']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['error']);

    // Mock the `get` method to return an observable

    await TestBed.configureTestingModule({
      declarations: [BuyProductComponent, SpinnerComponent], // Remove TranslatePipe from declarations
      imports: [FormsModule, TranslateModule.forRoot()], // Add TranslatePipe to imports
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { data: of({ productDetails: [{ productId: 1, productActualPrice: 100, productDiscountedPrice: 90 }] }) }
        },
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: ToastrService, useValue: mockToastrService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product details and order details on ngOnInit', () => {
    expect(component.productDetails.length).toBe(1);
    expect(component.orderDetails.orderProductQuantityList.length).toBe(1);
    expect(component.orderDetails.orderProductQuantityList[0].productId).toBe(1);
  });

  it('should calculate total price for a product', () => {
    const total = component.getCalculatedTotal(1, 100);
    expect(total).toBe(100); // 1 unidad x 100
  });

  it('should update quantity of a product', () => {
    component.onQuantityChanged(3, 1);
    expect(component.orderDetails.orderProductQuantityList[0].quantity).toBe(3);
  });

  it('should calculate grand total correctly', () => {
    component.onQuantityChanged(2, 1);
    const grandTotal = component.getCalculatedGrandTotal();
    expect(grandTotal).toBe(180); // 2 x 90 (precio con descuento)
  });

  it('should return a valid payment URL on processPayment', (done) => {
    mockPaymentService.getURLPaypalPayment.and.returnValue(of({ url: 'https://paypal.com/payment' }));

    component['processPayment']().subscribe((paymentUrl) => {
      expect(paymentUrl).toBe('https://paypal.com/payment');
      done();
    });
  });
});