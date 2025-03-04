import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const buyProductResolver: ResolveFn<Product[] | null> = (route, state) => {
  const productService = inject(ProductService);
  const toastrService = inject(ToastrService);

  // Obtener parámetros de los query params
  const isSingleProductCheckout = route.queryParamMap.get('isSingleProductCheckout') === 'true';
  const productId = Number(route.queryParamMap.get('id'));
  console.log("resolver")

  // Llamar al servicio para obtener los detalles del producto
  return productService.getProductDetails(isSingleProductCheckout, productId).pipe(
    tap((data) => console.log('Datos obtenidos en el resolver:', data)),

    catchError((error) => {
      console.error('Error loading product details', error);
      toastrService.error('Failed to load product data.', 'Error');
      return of(null); 
    })
  );
};
