import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

/**
 * Component for user registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: User = {
    userName: '',
    userFirstName: '',
    userLastName: '',
    userPassword: ''
  };
  
  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router
  ) {

  }

  /**
   * Handles user registration by submitting the registration form.
   * @param registerForm The registration form data.
   */
  register(registerForm: NgForm) {
    if (registerForm.valid) {
      this.userService.register(this.user).subscribe({
        next: () => {
          this.toastrService.success('Account created successfully', 'Success');
          this.router.navigate(['login']);
        },
        error: (errorResponse) => {
          if (errorResponse.status === 400 && errorResponse.error === 'Username already exists') {
            this.toastrService.error('The username is already taken. Please choose another.', 'Error');
          } else {
            this.toastrService.error('Error while creating the account', 'Error');
          }
        }
      });
    }
  }
  
}
