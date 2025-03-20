import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

// npm install -g @compodoc/compodoc
// npm install --save-dev @compodoc/compodoc
// Documentación npx compodoc -p tsconfig.json


/**
 * Component responsible for displaying the home page with a list of products.
 * Supports pagination, search functionality, and navigation to product details.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  /** List of products displayed on the page */
  products: Product[] = [];

  /** Current page number for pagination */
  currentPage: number = 0;

  /** Total number of pages available */
  totalPages: number = 0;

  /** Total number of elements available */
  totalElements: number = 0;

  /** Number of products displayed per page */
  pageSize: number = 8;

  /** Array containing the available pages */
  pages: number[] = [];

  /** Search key used for filtering products */
  searchKey: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.getAllProductsPaginated(this.currentPage, this.pageSize);
  }

  /**
   * Retrieves a paginated list of products from the backend.
   * @param page Current page number.
   * @param size Number of products per page.
   */
  getAllProductsPaginated(page: number, size: number): void {
    this.productService.getAllProductsPaginated(page, size).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pageSize = response.pageSize;

        // Crear el array de páginas a mostrar
        this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
      }, error: (err) => {
        this.toastrService.error('Error, could not retrieve the product list  ' + err.error, 'Error')
      }
    });
  }

  /**
   * Changes the current page for pagination and fetches new data.
   * @param page Page number to navigate to.
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllProductsPaginated(page, this.pageSize);
    }
  }

  /**
   * Returns a subset of pagination numbers to display for navigation.
   * @returns An array of page numbers within the visible range.
   */
  getVisiblePages(): number[] {
    const range = 2; // Número de páginas a mostrar antes y después de la página actual
    const start = Math.max(0, this.currentPage - range);
    const end = Math.min(this.totalPages - 1, this.currentPage + range);
    
    const visiblePages = [];
    
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  }  

   /**
   * Navigates to the product details page.
   * @param productId The ID of the selected product.
   */
  showProductDetails(productId: number) {
    this.router.navigate([`/productViewDetails/${productId}`]); 
  }
  
   /**
   * Searches for products based on the given search key.
   * If the search key is empty, it resets the product list to paginated results.
   * @param searchKey The search query entered by the user.
   */
  searchProducts(searchKey: string): void {
    this.searchKey = searchKey;
    if (this.searchKey.trim() === '') {
      this.getAllProductsPaginated(this.currentPage, this.pageSize);
    } else {
      this.productService.searchProducts(this.searchKey, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.products = response.content;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.pageSize = response.pageSize;
  
            // Crear el array de páginas a mostrar
            this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
          }, error: (err) => {
            this.toastrService.error('An unexpected error occurred: ' + err.error, 'Error')
          }
        });
    }
  }

}
