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

  /** Indicates whether the user is on a desktop device */
  isDesktop: boolean = true;
  
  /** Holds the details of the product being viewed */
  product: Product | null = null;
  
  /** Stores the currently selected product image */
  selectedImage: Image = {
    shortName: '',
    id: 0,
    name: '',
    type: '',
    picByte: ''
  }
  
  /** Tracks if the selected image has been changed */
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

  /**
   * Detects window resizing and updates the `isDesktop` flag accordingly.
   * @param event The resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = window.innerWidth > 768;
  }

   /**
   * Updates the selected image when a new image is chosen.
   * @param image The selected image
   */
  selectImage(image: Image) {
    this.selectedImage = image;
    this.imageChanged = true;
  }

   /**
   * Navigates to the product checkout page for purchasing a single product.
   * @param productId The ID of the product to buy
   */
  buyProduct(productId: number) {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: productId
      }
    });    
  }

   /**
   * Adds a product to the shopping cart.
   * @param productId The ID of the product to add to the cart
   */
  addToCart(productId: number) {
    this.productService.addToCart(productId).subscribe({
      next: (data) => {
        this.toastrService.success("Product added to the cart", "Success");
      }, error: () => {
        this.toastrService.error("Something went wrong. Could not add the product to the cart", "Error")
      }
    });
  }

   /**
   * Checks if the current user has a standard user role.
   * @returns `true` if the user is a standard user, otherwise `false`
   */
  public isUser(): boolean {
    return this.userAuthService.isUser();
  }
  
}
