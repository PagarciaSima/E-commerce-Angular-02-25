import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL: string = environment.apiURLAuthenticate;

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) { }

  public login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.apiURL, loginData, {headers: new HttpHeaders( {'No-Auth': 'True'} )});
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles() || [];
    return userRoles.length > 0 && userRoles.every(role => allowedRoles.includes(role));
  }
  
}
