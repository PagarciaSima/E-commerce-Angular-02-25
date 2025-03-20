import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Image } from '../interfaces/image';

/**
 * Service for handling image-related operations, such as uploading, retrieving, and deleting images.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Uploads an image file to the server.
   * @param file The image file to upload.
   * @returns An `Observable` containing the uploaded image details.
   */
  uploadImage(file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);  
  
    return this.httpClient.post<Image>(`${this.apiURL}/images/upload`, formData);
  }
  
  /**
   * Retrieves a list of images associated with a specific product.
   * @param productId The ID of the product.
   * @returns An `Observable` containing an array of images.
   */
  getProductImages(productId: number): Observable<Image[]> {
    return this.httpClient.get<Image[]>(`${this.apiURL}/api/v1/products/${productId}/images`);
  }

  /**
   * Deletes an image by its ID.
   * @param id The ID of the image to delete.
   * @returns An `Observable` indicating the result of the deletion operation.
   */
  deleteImage(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiURL}/images/${id}`);
  }

  /**
   * Retrieves an image as a Base64-encoded string.
   * @param imageId The ID of the image.
   * @returns An `Observable` containing the image in Base64 format.
   */
  getImageAsBase64(imageId: number): Observable<string> {
    return this.httpClient.get<string>(`${this.apiURL}/images/image/${imageId}`, { responseType: 'text' as 'json' });
  }

}
