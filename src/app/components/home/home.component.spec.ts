import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // Create spies for all dependencies
    mockProductService = jasmine.createSpyObj('ProductService', ['getAllProductsPaginated', 'searchProducts']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['error']);
    mockTranslate = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, SearchBarComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslate }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Mock the initial call to getAllProductsPaginated in ngOnInit
    const mockResponse = { content: [], totalPages: 5, totalElements: 20, pageSize: 8 };
    mockProductService.getAllProductsPaginated.and.returnValue(of(mockResponse));

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch paginated products on init', () => {
    expect(mockProductService.getAllProductsPaginated).toHaveBeenCalledWith(0, 8);
    expect(component.totalPages).toBe(5);
    expect(component.totalElements).toBe(20);
  });

  it('should handle error when fetching paginated products', () => {
    // Mock an error response
    mockProductService.getAllProductsPaginated.and.returnValue(throwError(() => ({ error: 'Server Error' })));
    mockTranslate.instant.and.returnValue('Error: ');

    // Call the method directly
    component.getAllProductsPaginated(0, 8);

    // Verify the error handling
    expect(mockToastrService.error).toHaveBeenCalledWith('Error: Server Error', 'Error');
  });

  it('should navigate to product details page', () => {
    component.showProductDetails(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/productViewDetails/1']);
  });

  it('should return visible pages for pagination', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toContain(3);
    expect(visiblePages).toContain(7);
  });

  it('should perform search and update product list', () => {
    const mockResponse = { content: [], totalPages: 2, totalElements: 10, pageSize: 8 };
    mockProductService.searchProducts.and.returnValue(of(mockResponse));

    component.searchProducts('test');

    expect(mockProductService.searchProducts).toHaveBeenCalledWith('test', 0, 8);
    expect(component.totalPages).toBe(2);
  });

  it('should reset product list if search key is empty', () => {
    spyOn(component, 'getAllProductsPaginated');
    component.searchProducts('');
    expect(component.getAllProductsPaginated).toHaveBeenCalledWith(0, 8);
  });
});