import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Image } from '../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }

  uploadImage(file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);  
  
    return this.httpClient.post<Image>(`${this.apiURL}/images/upload`, formData);
  }
  
  getProductImages(productId: number): Observable<Image[]> {
    return this.httpClient.get<Image[]>(`${this.apiURL}/api/v1/products/${productId}/images`);
  }

  deleteImage(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiURL}/images/${id}`);
  }

  getImageAsBase64(imageId: number): Observable<string> {
    return this.httpClient.get<string>(`${this.apiURL}/images/image/${imageId}`, { responseType: 'text' as 'json' });
  }

}
