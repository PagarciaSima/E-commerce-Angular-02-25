import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  products: Product[] = [];
  currentPage: number = 0;  
  totalPages: number = 0;   
  totalElements: number = 0; 
  pageSize: number = 8;     
  pages: number[] = [];     
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

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getAllProductsPaginated(page, this.pageSize);
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

  showProductDetails(productId: number) {
    this.router.navigate([`/productViewDetails/${productId}`]); 
  }

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
