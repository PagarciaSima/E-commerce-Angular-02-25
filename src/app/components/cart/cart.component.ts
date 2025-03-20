import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/interfaces/cart';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component for managing the shopping cart functionality.
 */
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  /** List of cart items */
  cartDetails: Cart[] = [];
  /** Current page for pagination */
  currentPage: number = 0;
  /** Total number of pages */
  totalPages: number = 0;
  /** Total number of elements in the cart */
  totalElements: number = 0;
  /** Number of items per page */
  pageSize: number = 8;
  /** List of available pages */
  pages: number[] = [];
  /** Search key for filtering cart items */
  searchKey: string = '';

  /**
   * Constructor
   * @param toastrService Toastr service for notifications
   * @param productService Service for handling product-related API calls
   * @param router Angular Router for navigation
   */
  constructor(
    private toastrService: ToastrService,
    private productService: ProductService,
    private router: Router
  ) {
    
  }

  /**
   * Initializes the component and loads the cart details.
   */
  ngOnInit(): void {
    this.getCartDetailsPaginated(this.currentPage, this.pageSize);
  }

  /**
   * Changes the current page and fetches the corresponding cart details.
   * @param page Page number to navigate to
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getCartDetailsPaginated(page, this.pageSize);
    }
  }

   /**
   * Retrieves the range of visible pages for pagination.
   * @returns An array of page numbers to be displayed in the pagination controls
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
   * Fetches cart details with pagination.
   * @param page The current page
   * @param size Number of items per page
   */
  getCartDetailsPaginated(page: number, size: number): void {
    this.productService.getCartDetailsPaginated(page, size).subscribe({
      next: (response) => {
        this.cartDetails = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pageSize = response.pageSize;

        // Crear el array de páginas a mostrar
        this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
      }, error: (err) => {
        this.toastrService.error('Error, could not retrieve your cart details ' + err.error, 'Error')
      }
    });
  }
  
  /**
   * Searches for cart items based on the given keyword.
   * @param searchKey The search term used to filter cart items
   */
  searchCartDetails(searchKey: string): void {
    this.searchKey = searchKey;
  
    if (searchKey.trim() === '') {
      this.getCartDetailsPaginated(this.currentPage, this.pageSize);
    } else {
      this.productService.searchCartDetails(searchKey, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.cartDetails = response.content;
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

  /**
   * Navigates to the checkout page.
   */
  checkout() {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: false,
        id: 0
      }
    });    
  }

   /**
   * Deletes a product from the cart by its ID.
   * @param id The ID of the cart item to be removed
   */
  delete(id: number) {
    this.productService.deleteCartById(id).subscribe({
      next: () => {
        this.toastrService.success('Product removed from the cart', 'Success');
        this.getCartDetailsPaginated(this.currentPage, this.pageSize);
      }, error: (err) => {
        this.toastrService.error('An unexpected error occurred: ' + err.error, 'Error')
      }
    });
  }
  
}
