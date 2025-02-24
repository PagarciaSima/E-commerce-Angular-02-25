import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
 apiURL: string = environment.apiURL;
  
  constructor(
    private httpClient: HttpClient
  ) { }

  getPdf(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/pdf`, { responseType: 'blob' as 'json' });
  }

  getCsv(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/csv`, { responseType: 'blob' as 'json' });
  }

  getExcel(): Observable<Blob> {
    // Fetch the PDF as a Blob
    return this.httpClient.get<Blob>(`${this.apiURL}/products/excel`, { responseType: 'blob' as 'json' });
  }
  
}
