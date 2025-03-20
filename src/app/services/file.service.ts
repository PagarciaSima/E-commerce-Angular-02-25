import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

/**
 * Service for handling file downloads (PDF, CSV, Excel).
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Downloads a PDF file.
   * @returns An `Observable` containing the PDF file as a `Blob`.
   */
  getPdf(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/pdf`, { responseType: 'blob' as 'json' });
  }

  /**
   * Downloads a CSV file.
   * @returns An `Observable` containing the CSV file as a `Blob`.
   */
  getCsv(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/csv`, { responseType: 'blob' as 'json' });
  }

  /**
   * Downloads an Excel file.
   * @returns An `Observable` containing the Excel file as a `Blob`.
   */
  getExcel(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/excel`, { responseType: 'blob' as 'json' });
  }
  
}
