import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL: string = environment.apiURLAuthenticate;

  requestHeader = new HttpHeaders(
    { "No-Auth": "True" }
  );

  constructor(
    private httpClient: HttpClient
  ) { }

  public login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.apiURL, loginData, { headers: this.requestHeader})
  }
}
