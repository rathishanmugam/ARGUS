import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface User {
  id?: number;
  first: string;
  last: string;
  email: string;
  phone: string;
  location: string;
  hobby: string;
  added?: Date;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API = 'http://localhost:8081';

  constructor(private http: HttpClient) {
  }
  // get all users
  getUsers(page, limit, sort, order, filter): Observable<any> {
    return this.http.get(`${this.API}/api/user`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort.toString())
        .set('order', order.toString())
        .set('filter', filter)

    });
  }
  // get the specific user but not implemented
  getUserById(body): Observable<any> {
    return this.http.get(`${this.API}/api/user/${body}`);

  }
  // update the user
  updateUser(body): Observable<any> {
    return this.http.put(`${this.API}/api/user/${body._id}`, body);

  }
  // add the user
  addUser(body): Observable<any> {
    return this.http.post(`${this.API}/api/user`, body);

  }
  // delete the user
  deleteUser(body): Observable<any> {
    console.log('iam in delete user');
    return this.http.delete(`${this.API}/api/user/${body._id}`);

  }

}
