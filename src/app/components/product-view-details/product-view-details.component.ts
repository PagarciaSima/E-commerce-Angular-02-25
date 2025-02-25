import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'src/app/interfaces/image';
import { Product } from 'src/app/interfaces/product';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
    this.selectedImage = image; // Cambiar la imagen grande al hacer click
  }

  buyProduct(productId: number) {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: productId
      }
    });    
  }
  
}
