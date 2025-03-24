import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getCartDetailsPaginated', 'searchCartDetails', 'deleteCartById']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      declarations: [CartComponent, SearchBarComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart details on initialization', () => {
    const mockResponse = { content: [], totalPages: 2, totalElements: 10, pageSize: 8 };
    mockProductService.getCartDetailsPaginated.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(mockProductService.getCartDetailsPaginated).toHaveBeenCalledWith(0, 8);
    expect(component.totalPages).toBe(2);
  });

  it('should change page and fetch new cart details', () => {
    component.totalPages = 3;
    spyOn(component, 'getCartDetailsPaginated');

    component.changePage(1);

    expect(component.getCartDetailsPaginated).toHaveBeenCalledWith(1, 8);
  });

  it('should not change page if out of bounds', () => {
    spyOn(component, 'getCartDetailsPaginated');
    component.totalPages = 2;

    component.changePage(-1);
    component.changePage(3);

    expect(component.getCartDetailsPaginated).not.toHaveBeenCalled();
  });

  it('should search for cart items', () => {
    const mockResponse = { content: [], totalPages: 1, totalElements: 5, pageSize: 8 };
    mockProductService.searchCartDetails.and.returnValue(of(mockResponse));

    component.searchCartDetails('test');

    expect(mockProductService.searchCartDetails).toHaveBeenCalledWith('test', 0, 8);
  });

  it('should handle searchCartDetails error', () => {
    mockProductService.searchCartDetails.and.returnValue(throwError(() => ({ error: 'Error' })));

    component.searchCartDetails('test');

    expect(mockToastrService.error).toHaveBeenCalled();
  });

  it('should navigate to checkout', () => {
    component.checkout();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/buyProduct'], {
      queryParams: { isSingleProductCheckout: false, id: 0 },
    });
  });

  it('should delete an item and refresh cart', fakeAsync(() => {
    // Mock the deleteCartById method to return an Observable<void>
    mockProductService.deleteCartById.and.returnValue(of(void 0));
  
    // Spy on the getCartDetailsPaginated method
    spyOn(component, 'getCartDetailsPaginated');
  
    // Call the delete method
    component.delete(1);
  
    // Simulate the passage of time until all observables are resolved
    tick();
  
    // Verify that deleteCartById was called with the correct ID
    expect(mockProductService.deleteCartById).toHaveBeenCalledWith(1);
  
    // Verify that ToastrService.success was called
    expect(mockToastrService.success).toHaveBeenCalled();
  
    // Verify that getCartDetailsPaginated was called to refresh the cart
    expect(component.getCartDetailsPaginated).toHaveBeenCalledWith(component.currentPage, component.pageSize);
  }));

  it('should handle delete error', fakeAsync(() => {
    mockProductService.deleteCartById.and.returnValue(throwError(() => ({ error: 'Delete error' })));

    component.delete(1);
    tick();

    expect(mockToastrService.error).toHaveBeenCalled();
  }));
});