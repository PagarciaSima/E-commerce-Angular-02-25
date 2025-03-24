import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SaveProductComponent } from './save-product.component';
import { ProductService } from 'src/app/services/product.service';
import { ImageServiceService } from 'src/app/services/image.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { Image } from 'src/app/interfaces/image';

describe('SaveProductComponent', () => {
  let component: SaveProductComponent;
  let fixture: ComponentFixture<SaveProductComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockImageService: jasmine.SpyObj<ImageServiceService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockProduct: Product = {
    productId: 1,
    productName: 'Test Product',
    productDescription: 'Test Description',
    productDiscountedPrice: 100,
    productActualPrice: 120,
    productImages: [
      {
        id: 1,
        name: 'image1.png',
        shortName: 'img1',
        type: 'image/png',
        picByte: 'base64encodedstring',
      },
    ],
  };

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProductById',
      'addProduct',
      'updateProduct',
    ]);
    mockImageService = jasmine.createSpyObj('ImageServiceService', ['deleteImage']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'), // Simulate product ID
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [SaveProductComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ImageServiceService, useValue: mockImageService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveProductComponent);
    component = fixture.componentInstance;
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details in edit mode', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    component.ngOnInit();
    expect(component.isEditMode).toBeTrue();
    expect(component.product).toEqual(mockProduct);
    expect(component.imagePreviews).toEqual(mockProduct.productImages!);
  });

  it('should show warning if discounted price is greater than actual price', () => {
    const mockForm = { valid: true } as NgForm;
    component.product.productDiscountedPrice = 150;
    component.product.productActualPrice = 100;
    component.addProduct(mockForm);
    expect(mockToastrService.warning).toHaveBeenCalledWith('Translated message', 'Warning');
    expect(mockProductService.addProduct).not.toHaveBeenCalled();
  });


  it('should create a new product', fakeAsync(() => {
    const mockForm = {
      valid: true,
      resetForm: jasmine.createSpy('resetForm')
    } as any;
    mockProductService.addProduct.and.returnValue(of(mockProduct));
    component.addProduct(mockForm);
    tick();
    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/showProductDetails']);
    expect(mockForm.resetForm).toHaveBeenCalled(); // Verifica que resetForm fue llamado
  }));

  it('should update an existing product', fakeAsync(() => {
    component.isEditMode = true;
    component.product.productId = 1;
    const mockForm = { valid: true } as NgForm;
    mockProductService.updateProduct.and.returnValue(of({}));
    component.addProduct(mockForm);
    tick(); // Wait for async operations to complete
    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/showProductDetails']);
  }));

  it('should handle file selection and preview images', fakeAsync(() => {
    const file = new File([''], 'test.jpg', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;

    const fileReaderMock = jasmine.createSpyObj('FileReader', [
        'readAsDataURL',
    ]);

    fileReaderMock.result = 'data:image/png;base64,base64encodedstring';
    spyOn(window, 'FileReader').and.returnValue(fileReaderMock);

    component.onFileSelected(event);
    fileReaderMock.onload({ target: fileReaderMock } as any);
    tick();

    expect(component.selectedFiles.length).toBe(1);
    expect(component.imagePreviews.length).toBe(1);
  }));

  it('should remove an image', () => {
    const mockImage: Image = {
      id: 1,
      name: 'image1.png',
      shortName: 'img1',
      type: 'image/png',
      picByte: 'base64encodedstring',
    };
    component.imagePreviews = [mockImage];
    component.isEditMode = true;
    mockImageService.deleteImage.and.returnValue(of({}));
    component.removeFile(0);
    expect(mockImageService.deleteImage).toHaveBeenCalledWith(mockImage.id);
    expect(component.imagePreviews.length).toBe(0);
  });

  it('should clear the form', () => {
    const mockForm = {
      resetForm: jasmine.createSpy('resetForm'),
    } as any;

    component.product = mockProduct;
    component.selectedFiles = [new File([''], 'test.jpg')];
    component.imagePreviews = [mockProduct.productImages![0]];
    component.clearForm(mockForm);

    expect(mockForm.resetForm).toHaveBeenCalled();
    expect(component.product).toEqual({
      productName: '',
      productDescription: '',
      productDiscountedPrice: 0,
      productActualPrice: 0,
    });
    expect(component.selectedFiles.length).toBe(0);
    expect(component.imagePreviews.length).toBe(0);
  });
});