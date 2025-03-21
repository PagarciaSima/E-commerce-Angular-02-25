import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from 'src/app/services/i18n.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

/**
 * Header component responsible for displaying navigation options based on user authentication.
 * 
 * This component provides methods to check the user's authentication status, determine roles, 
 * and handle logout functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private userAuthService: UserAuthService,
    private router: Router, 
    private i18nService: I18nService
  ) {

  }

  /**
   * Checks if a user is logged in.
   * 
   * @returns `true` if the user is logged in, otherwise `false`.
   */
  public isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  /**
   * Logs out the user by clearing authentication data and redirecting to the login page.
   */
  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the logged-in user has admin privileges.
   * 
   * @returns `true` if the user is an admin, otherwise `false`.
   */
  public isAdmin(): boolean {
    return this.userAuthService.isAdmin();
  }

  /**
   * Checks if the logged-in user has regular user privileges.
   * 
   * @returns `true` if the user is a regular user, otherwise `false`.
   */
  public isUser(): boolean {
    return this.userAuthService.isUser();
  }

  changeLanguage(lang: string) {
    this.i18nService.changeLanguage(lang)
  }
}
