import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductViewDetailsComponent } from './product-view-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Importa TranslateModule
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { of, throwError } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { Image } from 'src/app/interfaces/image';
import { Cart } from 'src/app/interfaces/cart';

describe('ProductViewDetailsComponent', () => {
  let component: ProductViewDetailsComponent;
  let fixture: ComponentFixture<ProductViewDetailsComponent>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockUserAuthService: jasmine.SpyObj<UserAuthService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockProduct: Product = {
    productId: 1,
    productName: 'Test Product',
    productDescription: 'Test Description',
    productDiscountedPrice: 100,
    productActualPrice: 120,
    productImages: [
      {
        shortName: 'img1',
        id: 1,
        name: 'image1.jpg',
        type: 'image/jpeg',
        picByte: 'base64encodedstring',
      },
      {
        shortName: 'img2',
        id: 2,
        name: 'image2.jpg',
        type: 'image/jpeg',
        picByte: 'base64encodedstring',
      },
    ],
  };

  const mockCart: Cart = {
    cartId: 1,
    productEntity: {
      productId: 1,
      productName: 'Test Product',
      productDescription: 'Test Description',
      productDiscountedPrice: 100,
      productActualPrice: 120,
      productImages: [],
    },
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockProductService = jasmine.createSpyObj('ProductService', ['addToCart']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockUserAuthService = jasmine.createSpyObj('UserAuthService', ['isUser']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    mockActivatedRoute = {
      data: of({ product: mockProduct }), // Simula el resolver
    };

    await TestBed.configureTestingModule({
      declarations: [ProductViewDetailsComponent],
      imports: [TranslateModule.forRoot()], // Importa TranslateModule
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: UserAuthService, useValue: mockUserAuthService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductViewDetailsComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product and selected image on ngOnInit', () => {
    component.ngOnInit();

    expect(component.product).toEqual(mockProduct);
    expect(component.selectedImage).toEqual(mockProduct.productImages![0]);
    expect(component.isDesktop).toBe(window.innerWidth > 514);
  });

  it('should update isDesktop on window resize', () => {
    const event = new Event('resize');
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    component.onResize(event);

    expect(component.isDesktop).toBeFalse();
  });

  it('should select an image', () => {
    const newImage: Image = {
      shortName: 'img2',
      id: 2,
      name: 'image2.jpg',
      type: 'image/jpeg',
      picByte: 'base64encodedstring',
    };

    component.selectImage(newImage);

    expect(component.selectedImage).toEqual(newImage);
    expect(component.imageChanged).toBeTrue();
  });

  it('should navigate to buyProduct page', () => {
    const productId = 1;

    component.buyProduct(productId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: productId,
      },
    });
  });

  it('should add product to cart and show success message', () => {
    const productId = 1;
    mockProductService.addToCart.and.returnValue(of(mockCart)); // Devuelve un Observable<Cart>

    component.addToCart(productId);

    expect(mockProductService.addToCart).toHaveBeenCalledWith(productId);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
  });

  it('should show error message when addToCart fails', () => {
    const productId = 1;
    mockProductService.addToCart.and.returnValue(throwError('Error'));

    component.addToCart(productId);

    expect(mockProductService.addToCart).toHaveBeenCalledWith(productId);
    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should return true if user is a standard user', () => {
    mockUserAuthService.isUser.and.returnValue(true);

    const result = component.isUser();

    expect(result).toBeTrue();
    expect(mockUserAuthService.isUser).toHaveBeenCalled();
  });
});