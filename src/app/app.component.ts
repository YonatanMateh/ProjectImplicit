import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit  {
  users: User[];
  constructor(private userService: UserService) {
    this.userService.usersChanged.subscribe(users => {
      this.users = users;
    })
  }

  ngOnInit() {
    this.userService.getUsers();
  }
}
