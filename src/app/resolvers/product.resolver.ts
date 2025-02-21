import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(ProductService);
  const toastrService = inject(ToastrService);
  const productId = Number(route.paramMap.get('productId'));

  // Traza para verificar el valor del productId
  console.log('Resolviendo producto con ID:', productId);

  if (!productId) {
    toastrService.error('Product ID is missing in the route.', 'Error');
    console.error('Product ID is missing.');
    return of(null);
  }

  return productService.getProductById(productId).pipe(
    catchError((error) => {
      toastrService.error('Failed to load product data.', 'Error');
      console.error('Error al cargar el producto:', error);
      return of(null);
    })
  );
};
