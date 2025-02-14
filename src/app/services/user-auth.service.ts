import { Injectable } from '@angular/core';
import { Role } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public setRoles(roles: Role []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const roles = localStorage.getItem("roles");
    return roles 
      ? JSON.parse(roles).map((role: { roleName: string, roleDescription: string }) => role.roleName) 
      : [];
  }

  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string {
    let token = localStorage.getItem("jwtToken") || "";
    return token.replace("Bearer ", "");  
  } 

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn(): boolean {
    const roles = localStorage.getItem("roles");
    const token = localStorage.getItem("jwtToken");
  
    return roles !== null && roles !== "" && token !== null && token !== "";
  }

  public isAdmin(): boolean {
    const roles: string [] = this.getRoles();
    return roles.includes('AdminRole'); 
  }

  public isUser(): boolean {
    const roles: string [] = this.getRoles();
    return roles.includes('UserRole'); 
  }
}
