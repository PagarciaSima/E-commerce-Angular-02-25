import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/interfaces/cart';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  cartDetails: Cart[] = [];
  currentPage: number = 0; 
  totalPages: number = 0;   
  totalElements: number = 0;
  pageSize: number = 8;     
  pages: number[] = [];      
  searchKey: string = ''; 

  constructor(
    private toastrService: ToastrService,
    private productService: ProductService
  ) {
    
  }

  ngOnInit(): void {
    this.getCartDetailsPaginated(this.currentPage, this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getCartDetailsPaginated(page, this.pageSize);
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
  
}
