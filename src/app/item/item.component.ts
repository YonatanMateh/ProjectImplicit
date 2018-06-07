import { Component, OnInit, Input, Output } from '@angular/core';
import { UserService } from '../services/user.service';

import { User } from '../models/User';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() user: User;
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  removeUser() {
    this.userService.removeUser(this.user.id)
  }

}
