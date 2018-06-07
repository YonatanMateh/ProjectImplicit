import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';

import { keys } from '../models/Keys';
import { User } from '../models/User';


const outh = `client_id=${keys.client_id}&client_secret=${keys.client_secret}`;

@Injectable()
export class UserService {
  users: User[];

  //set up for a listenr to the changes of the users array
  usersChanged: Subject<User[]> = new Subject<User[]>();
  constructor(private http: HttpClient) {
    this.usersChanged.subscribe((users) => {
      this.users = users;
    });
  }

  //public method for getting the users. setting the currect type of the user
  getUsers() {
    this.http.get(this.mainUrl(3)).toPromise().then(data => {
      this.getUserDetails(data).then(users => {
        this.usersChanged.next(users);
      });
    });
  }

  //getting one new user (after deleting other user)
  getOneUser() {
    return this.http.get(this.mainUrl(1)).toPromise().then(data => {
      return this.getUserDetails(data);
    })
  }


  removeUser(id: Number) {
    let index = this.users.findIndex(user => user.id === id);
    this.users.splice(index, 1);
    this.getOneUser().then((user: User[]) => {
      this.users.push(user[0])
    });
  }

  //url setup. argument: getting number of users to request
  private mainUrl(numOfUsers: Number) {
    let random = Math.floor((Math.random() * 1000000) + 1);
    return `https://api.github.com/users?since=${random}?page=1&per_page=${numOfUsers}&${outh}`;
  }

  //resuest user details.
  private getUserDetails = (data) => {
    let urls = this.getThreeUrls(data);
    return Promise.all(urls).then((responce): User[] => {
      let resultUsers = [];
      responce.forEach(tempUser => {
        let user = new User(tempUser['id'], tempUser['name'] || tempUser['login'], tempUser['company'],
          tempUser['avatar_url'], tempUser['url'], tempUser['html_url'], tempUser['location']);
        resultUsers.push(user);
      });
      return resultUsers;
    })
  }

  private getUserData(url) {
    return this.http.get(url).toPromise();
  }

  //extracting the users url
  private getThreeUrls(data): any[] {
    let urls = [];
    for (let i = 0; i < data.length; i++) {
      urls.push(this.getUserData(data[i]['url'] + `?${outh}`));
    }
    return urls;
  }

  private getUserUrl(data) {
    return this.getUserData(data[0]['url']);
  }

}
