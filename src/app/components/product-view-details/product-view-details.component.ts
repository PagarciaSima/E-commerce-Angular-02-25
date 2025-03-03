import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Image } from 'src/app/interfaces/image';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css']
})
export class ProductViewDetailsComponent implements OnInit {

  isDesktop: boolean = true;
  product: Product | null = null;
  selectedImage: Image = {
    shortName: '',
    id: 0,
    name: '',
    type: '',
    picByte: ''
  }
  imageChanged: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastrService: ToastrService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    // Accedemos a los datos resueltos que contienen el producto
    this.route.data.subscribe(data => {
      // 'product' es la clave del resolver
      this.product = data['product'];  
    });
    this.isDesktop = window.innerWidth > 514;

    if (this.product?.productImages && this.product.productImages.length > 0) {
      this.selectedImage = this.product.productImages[0];
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = window.innerWidth > 768;
  }

  selectImage(image: Image) {
    this.selectedImage = image;
    this.imageChanged = true;
  }

  buyProduct(productId: number) {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: productId
      }
    });    
  }

  addToCart(productId: number) {
    this.productService.addToCart(productId).subscribe({
      next: (data) => {
        this.toastrService.success("Product added to the cart", "Success");
      }, error: () => {
        this.toastrService.error("Something went wrong. Could not add the product to the cart", "Error")
      }
    });
  }

  public isUser(): boolean {
    return this.userAuthService.isUser();
  }
  
}
