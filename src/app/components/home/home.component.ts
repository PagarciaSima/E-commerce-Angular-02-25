import { Component, OnInit } from '@angular/core';
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

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      }, error: () => {
        this.toastrService.error("Error, could not retrieve product list", "Error")
      }
    });
  }

}
