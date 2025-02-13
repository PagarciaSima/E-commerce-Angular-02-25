import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  public message: string = '';

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.forUser();
  }

  forUser() {
    this.userService.forUser().subscribe({
      next: (data) => {
        console.log(data)
        this.message = data;
      }, error: (error) => {
        console.log(error)
      }
    })
  }

}
