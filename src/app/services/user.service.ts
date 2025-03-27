import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';
import { UserAuthService } from './user-auth.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL: string = environment.apiURL;

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) { }

  /**
   * Sends login credentials to the authentication endpoint.
   * @param loginData - The login request payload containing username and password.
   * @returns An observable containing the authentication response with a token and roles.
   */
  public login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiURL}/authenticate`, loginData, {headers: new HttpHeaders( {'No-Auth': 'True'} )});
  }

  /**
   * Checks if the user's roles match the allowed roles.
   * @param allowedRoles - An array of roles that are permitted.
   * @returns `true` if all user roles are included in the allowed roles, otherwise `false`.
   */
  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles() || [];
    return userRoles.length > 0 && userRoles.every(role => allowedRoles.includes(role));
  }

  /**
   * Sends a registration request to create a new user account.
   * @param user - The user details required for registration.
   * @returns An observable containing the registered user details.
   */
  public register(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiURL}/user/register`, user, {headers: new HttpHeaders( {'No-Auth': 'True'} )});
  }
}
