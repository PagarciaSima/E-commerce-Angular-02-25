import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  userPassword: string = '';
  userName: string = '';
  
  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
  }

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.toastrService.success('You have loged in successfully', 'Success')
      }, error: (error) => {
        console.log(error);

      }
    })
  }
}
