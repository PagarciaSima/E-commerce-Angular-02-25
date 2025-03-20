import { Injectable } from '@angular/core';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  /**
   * Stores user roles in local storage.
   * @param roles - An array of user roles.
   */
  public setRoles(roles: Role []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  /**
   * Retrieves stored user roles from local storage.
   * @returns An array of role names as strings.
   */
  public getRoles(): string[] {
    const roles = localStorage.getItem("roles");
    return roles 
      ? JSON.parse(roles).map((role: { roleName: string, roleDescription: string }) => role.roleName) 
      : [];
  }

  /**
   * Stores the JWT token in local storage.
   * @param jwtToken - The authentication token.
   */
  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  /**
   * Retrieves the stored JWT token from local storage.
   * Removes the "Bearer " prefix if present.
   * @returns The JWT token as a string.
   */
  public getToken(): string {
    let token = localStorage.getItem("jwtToken") || "";
    return token.replace("Bearer ", "");  
  } 

  /**
   * Clears all stored authentication data from local storage.
   */
  public clear() {
    localStorage.clear();
  }

  /**
   * Checks if a user is logged in by verifying stored roles and token.
   * @returns `true` if the user is logged in, otherwise `false`.
   */
  public isLoggedIn(): boolean {
    const roles = localStorage.getItem("roles");
    const token = localStorage.getItem("jwtToken");
  
    return roles !== null && roles !== "" && token !== null && token !== "";
  }

  /**
   * Checks if the user has an admin role.
   * @returns `true` if the user has the 'AdminRole', otherwise `false`.
   */
  public isAdmin(): boolean {
    const roles: string [] = this.getRoles();
    return roles.includes('AdminRole'); 
  }

  /**
   * Checks if the user has a standard user role.
   * @returns `true` if the user has the 'UserRole', otherwise `false`.
   */
  public isUser(): boolean {
    const roles: string [] = this.getRoles();
    return roles.includes('UserRole'); 
  }
}
