import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit{

  userPassword: string = '';
  userName: string = '';
  
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private toastrService: ToastrService, 
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }
  
  
  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe({
      next: (response) => {
        this.userAuthService.setRoles(response.user.role!);
        this.userAuthService.setToken(response.jwtToken);

        const roleName = response.user.role![0].roleName;

        if ('AdminRole' === roleName) {
          this.router.navigate(['/admin'])
        } else if ('UserRole' === roleName) {
          this.router.navigate(['/user'])
        }

        this.toastrService.success('You have logged in successfully', 'Success');
      },
      error: (error) => {
        console.log(error)
        if (error.status === 401) {
          this.toastrService.error('Invalid credentials. Please try again.', 'Error');
        } else if (error.status === 500) {
          this.toastrService.error('Server error. Please try later.', 'Error');
        } else {
          this.toastrService.error('An unexpected error occurred.', 'Error');
        }
      }
    });
  }
  
}
