import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  constructor(
    private userAuthService: UserAuthService,
    private router: Router, 
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
  }

  public isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/login']);
  }

  public isAdmin(): boolean {
    return this.userAuthService.isAdmin();
  }

  public isUser(): boolean {
    return this.userAuthService.isUser();
  }
}
