import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/**
 * Resolver for fetching product details before navigating to the buy page.
 * It retrieves product data based on query parameters.
 */
export const buyProductResolver: ResolveFn<Product[] | null> = (route, state) => {
  const productService = inject(ProductService);
  const toastrService = inject(ToastrService);

  // Obtener parámetros de los query params
  const isSingleProductCheckout = route.queryParamMap.get('isSingleProductCheckout') === 'true';
  const productId = Number(route.queryParamMap.get('id'));

  /**
   * Calls the product service to fetch product details.
   * Logs the retrieved data and handles errors with a toast notification.
   */
  return productService.getProductDetails(isSingleProductCheckout, productId).pipe(
    tap((data) => console.log('Datos obtenidos en el resolver:', data)),

    catchError((error) => {
      console.error('Error loading product details', error);
      toastrService.error('Failed to load product data.', 'Error');
      return of(null); 
    })
  );
};
