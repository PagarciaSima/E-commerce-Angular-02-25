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
  currentPage: number = 0;  // Página actual
  totalPages: number = 0;   // Total de páginas
  totalElements: number = 0; // Total de elementos (productos)
  pageSize: number = 8;     // Tamaño de página
  pages: number[] = [];      // Array de números de página para el paginador
  searchKey: string = ''; 

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.getAllProductsPaginated(this.currentPage, this.pageSize);
  }

   // Función para obtener los productos
   getAllProductsPaginated(page: number, size: number): void {
    this.productService.getAllProductsPaginated(page, size).subscribe(response => {
      this.products = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.pageSize = response.pageSize;

      // Crear el array de páginas a mostrar
      this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
    });
  }

  // Cambiar la página
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

  searchProducts(): void {
    console.log(this.searchKey)
    if (this.searchKey.trim() === '') {
      console.log("if")

      this.getAllProductsPaginated(this.currentPage, this.pageSize);
    } else {
      this.productService.searchProducts(this.searchKey, this.currentPage, this.pageSize)
        .subscribe(response => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.pageSize = response.pageSize;

          // Crear el array de páginas a mostrar
          this.pages = Array.from({ length: this.totalPages }, (_, index) => index);
        });
    }
  }
  

}
