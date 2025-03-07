import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MyOrderDetails } from 'src/app/interfaces/my-order-details';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit{

  myOrderDetails: MyOrderDetails[] = [];
  currentPage: number = 0;  
  totalPages: number = 0;   
  totalElements: number = 0; 
  pageSize: number = 8;     
  pages: number[] = [];     
  searchKey: string = ''; 

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getMyOrdersPaginated(this.currentPage, this.pageSize)
  }

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

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getMyOrdersPaginated(page, this.pageSize);
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
