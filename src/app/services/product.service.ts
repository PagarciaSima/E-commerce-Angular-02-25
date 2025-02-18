import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }

  addProduct(product: Product, files: File[]): Observable<Product> {
    const formData = new FormData();

    // Añadir el producto (como JSON convertido en un Blob)
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    // Añadir los archivos de imagen, si los hay
    if (files && files.length > 0) {
      files.forEach(file => formData.append('imageFile', file, file.name));
    }

    return this.httpClient.post<Product>(`${this.apiURL}/product`, formData);
  }

  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}/products`);
  }
}
