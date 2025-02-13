import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public message: string = '';

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.forAdmin()
  }

  forAdmin() {
    this.userService.forAdmin().subscribe({
      next: (data) => {
        console.log(data)
        this.message = data;
      }, error: (error) => {
        console.log(error)
      }
    })
  }
}
