import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  myOrderDetails: MyOrderDetails[] = [];
  currentPage: number = 0;  
  totalPages: number = 0;   
  totalElements: number = 0; 
  pageSize: number = 8;     
  pages: number[] = [];     
  searchKey: string = '';
  orderStatus: string = 'all';

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
  }

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

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllOrdersPaginated(page, this.pageSize, this.orderStatus);
    }
  }

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

  searchOrderDetails(searchKey: string): void {
    this.searchKey = searchKey;
    if (this.searchKey.trim() === '') {
      this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
    } else {
      this.productService.searchAllOrders(this.searchKey, this.currentPage, this.pageSize)
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

  filterOrders(status: string) {
    this.orderStatus = status;
    this.getAllOrdersPaginated(this.currentPage, this.pageSize, this.orderStatus);
  }
}
