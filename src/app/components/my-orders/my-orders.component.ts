import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component responsible for displaying and managing user orders.
 * It supports pagination and search functionality.
 */
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit{

  /** List of user orders retrieved from the backend */
  myOrderDetails: MyOrderDetails[] = [];

  /** Current page index for pagination */
  currentPage: number = 0;

  /** Total number of pages available */
  totalPages: number = 0;

  /** Total number of orders */
  totalElements: number = 0;

  /** Number of orders per page */
  pageSize: number = 8;

  /** Array representing available page numbers */
  pages: number[] = [];

  /** Search key used for filtering orders */
  searchKey: string = '';

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getMyOrdersPaginated(this.currentPage, this.pageSize)
  }

  /**
   * Retrieves paginated orders from the backend.
   * @param page The current page index.
   * @param size The number of orders per page.
   */
  getMyOrdersPaginated(page: number, size: number) {
    this.productService.getMyOrdersPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.myOrderDetails = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pageSize = response.pageSize;

        // Crear el array de páginas a mostrar
        this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
      }, error: (error) => {
        this.toastrService.error('Error while retrieving order details ' + error.error, 'Error');
      }
    }); 
  }

  /**
   * Changes the current page and fetches the corresponding orders.
   * @param page The page number to navigate to.
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getMyOrdersPaginated(page, this.pageSize);
    }
  }

  /**
   * Gets the visible page numbers for pagination controls.
   * @returns An array of page numbers surrounding the current page.
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
   * Searches for orders based on the provided search key.
   * If the search key is empty, fetches the full paginated order list.
   * @param searchKey The keyword used for searching orders.
   */
  searchOrderDetails(searchKey: string): void {
    this.searchKey = searchKey;
    if (this.searchKey.trim() === '') {
      this.getMyOrdersPaginated(this.currentPage, this.pageSize);
    } else {
      this.productService.searchMyOrders(this.searchKey, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.myOrderDetails = response.content;
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
