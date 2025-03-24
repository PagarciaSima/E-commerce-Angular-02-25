import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowProductDetailsComponent } from './show-product-details.component';
import { ProductService } from 'src/app/services/product.service';
import { FileService } from 'src/app/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as saveAs from 'file-saver';
import { Product } from 'src/app/interfaces/product';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

describe('ShowProductDetailsComponent', () => {
  let component: ShowProductDetailsComponent;
  let fixture: ComponentFixture<ShowProductDetailsComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockProducts: Product[] = [
    {
      productId: 1,
      productName: 'Product 1',
      productDescription: 'Description 1',
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
    },
    {
      productId: 2,
      productName: 'Product 2',
      productDescription: 'Description 2',
      productDiscountedPrice: 200,
      productActualPrice: 250,
      productImages: [],
    },
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getAllProductsPaginated',
      'deleteProduct',
      'searchProducts',
    ]);
    mockFileService = jasmine.createSpyObj('FileService', ['getPdf', 'getCsv', 'getExcel']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    // Mock saveAs
    spyOn(saveAs, 'saveAs');

    await TestBed.configureTestingModule({
      declarations: [ShowProductDetailsComponent, SearchBarComponent, SpinnerComponent],
      imports: [TranslateModule.forRoot()], // Add TranslateModule
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: FileService, useValue: mockFileService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowProductDetailsComponent);
    component = fixture.componentInstance;

    // Mock translations
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch paginated products on init', () => {
    const mockResponse = {
      content: mockProducts,
      totalPages: 1,
      totalElements: 2,
      pageSize: 10,
    };
    mockProductService.getAllProductsPaginated.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(component.products).toEqual(mockProducts);
    expect(component.totalPages).toBe(1);
    expect(component.totalElements).toBe(2);
    expect(component.pageSize).toBe(10);
  });

  it('should handle error when fetching products', () => {
    mockProductService.getAllProductsPaginated.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should change page and fetch products', () => {
    const mockResponse = {
      content: mockProducts,
      totalPages: 1,
      totalElements: 2,
      pageSize: 10,
    };
    mockProductService.getAllProductsPaginated.and.returnValue(of(mockResponse));

    component.changePage(1);

    expect(component.currentPage).toBe(1);
    expect(mockProductService.getAllProductsPaginated).toHaveBeenCalledWith(1, component.pageSize);
  });

  it('should delete a product after confirmation', () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      } as SweetAlertResult<unknown>)
    );
    mockProductService.deleteProduct.and.returnValue(of(''));

    component.delete(1);

    expect(Swal.fire).toHaveBeenCalled();
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
  });

  it('should not delete a product if confirmation is canceled', () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      } as SweetAlertResult<unknown>)
    );

    component.delete(1);

    expect(Swal.fire).toHaveBeenCalled();
    expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should navigate to edit product page', () => {
    component.editProductDetails(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/editProduct', 1]);
  });

  it('should show images in modal', () => {
    const product = mockProducts[0];
    component.viewImages(product);

    expect(component.selectedImages).toEqual([`data:image/png;base64,base64encodedstring`]);
    expect(component.showImageModal).toBeTrue();
  });

  it('should show warning if no images are available', () => {
    const product = mockProducts[1]; // Product with no images
    component.viewImages(product);

    expect(mockToastrService.warning).toHaveBeenCalledWith('Translated message', 'Warning');
  });

  it('should generate and download PDF', () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    mockFileService.getPdf.and.returnValue(of(mockBlob));

    component.generatePdf();

    expect(mockFileService.getPdf).toHaveBeenCalled();
    expect(saveAs.saveAs).toHaveBeenCalledWith(mockBlob, jasmine.any(String));
    expect(component.isGeneratingFile).toBeFalse();
  });

  it('should generate and download CSV', () => {
    const mockBlob = new Blob(['CSV content'], { type: 'text/csv' });
    mockFileService.getCsv.and.returnValue(of(mockBlob));

    component.generateCsv();

    expect(mockFileService.getCsv).toHaveBeenCalled();
    expect(saveAs.saveAs).toHaveBeenCalledWith(mockBlob, jasmine.any(String));
    expect(component.isGeneratingFile).toBeFalse();
  });

  it('should generate and download Excel', () => {
    const mockBlob = new Blob(['Excel content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockFileService.getExcel.and.returnValue(of(mockBlob));

    component.generateExcel();

    expect(mockFileService.getExcel).toHaveBeenCalled();
    expect(saveAs.saveAs).toHaveBeenCalledWith(mockBlob, jasmine.any(String));
    expect(component.isGeneratingFile).toBeFalse();
  });

  it('should search products', () => {
    const mockResponse = {
      content: mockProducts,
      totalPages: 1,
      totalElements: 2,
      pageSize: 10,
    };
    mockProductService.searchProducts.and.returnValue(of(mockResponse));

    component.searchProducts('Product');

    expect(component.products).toEqual(mockProducts);
    expect(component.totalPages).toBe(1);
    expect(component.totalElements).toBe(2);
    expect(component.pageSize).toBe(10);
  });

  it('should fetch all products if search key is empty', () => {
    const mockResponse = {
      content: mockProducts,
      totalPages: 1,
      totalElements: 2,
      pageSize: 10,
    };
    mockProductService.getAllProductsPaginated.and.returnValue(of(mockResponse));

    component.searchProducts('');

    expect(mockProductService.getAllProductsPaginated).toHaveBeenCalled();
  });
});