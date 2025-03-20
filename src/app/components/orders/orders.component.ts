import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component to manage and display paginated orders.
 * Provides functionalities such as pagination, filtering, searching, and updating order status.
 */
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  /** List of orders displayed in the component */
  myOrderDetails: MyOrderDetails[] = [];

  /** Current page number in pagination */
  currentPage: number = 0;

  /** Total number of pages available */
  totalPages: number = 0;

  /** Total number of elements (orders) */
  totalElements: number = 0;

  /** Number of orders per page */
  pageSize: number = 8;

  /** Array of available page numbers */
  pages: number[] = [];

  /** Search query for filtering orders */
  searchKey: string = '';

  /** Current order status filter */
  orderStatus: string = 'all';

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
  }

  /**
   * Fetches paginated orders based on the given page number, page size, and order status.
   * @param page - The current page number
   * @param size - Number of orders per page
   * @param orderStatus - Status filter for the orders
   */
  getAllOrdersPaginated(page: number, size: number, orderStatus: string) {
    this.productService.getAllOrdersPaginated(this.currentPage, this.pageSize, orderStatus).subscribe({
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
   * @param page - The new page number
   */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllOrdersPaginated(page, this.pageSize, this.orderStatus);
    }
  }

  /**
   * Returns an array of visible page numbers for pagination.
   * @returns An array of page numbers to display in pagination controls.
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
   * Searches for orders based on the given search key.
   * If the search key is empty, reloads the paginated orders.
   * @param searchKey - The search keyword
   */
  searchOrderDetails(searchKey: string): void {
    this.searchKey = searchKey;
    if (this.searchKey.trim() === '') {
      this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
    } else {
      this.productService.searchAllOrders(this.orderStatus, this.searchKey, this.currentPage, this.pageSize)
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

  /**
   * Updates the status of a specific order and reloads the order list.
   * @param id - The order ID to update
   * @param newStatus - The new status to apply
   */
  changeStatus(id: number, newStatus: string) {
    
    this.productService.changeStatus(id, newStatus).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, 'Success');
          this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
        },
        error: (err) => {
            this.toastrService.error('An unexpected error occurred: ' + err.error?.message || err.message, 'Error');
        }
    });
  }

  /**
   * Applies a filter to display orders based on their status.
   * @param status - The selected order status to filter
   */
  filterOrders(status: string) {
    this.orderStatus = status;
    this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
  }
}
