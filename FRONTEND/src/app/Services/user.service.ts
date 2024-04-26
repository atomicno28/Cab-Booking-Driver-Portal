import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CityService } from '../Services/city.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';
  constructor(private http: HttpClient, private cityService: CityService) {}

  getHttpOptions(): any {
    return this.cityService.getHttpOptions();
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/addUser`,
      user,
      this.getHttpOptions()
    );
  }

  getUsers(page: number, limit: number, sortField?: string): Observable<any> {
    let url = `${this.apiUrl}/getUsers?page=${page}&limit=${limit}`;
    if (sortField) {
      url += `&sortField=${sortField}`;
    }
    return this.http.get<any>(url, this.getHttpOptions());
  }

  updateUser(user: any, id: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateUser/${id}`,
      user,
      this.getHttpOptions()
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/deleteUser/${id}`,
      this.getHttpOptions()
    );
  }

  searchUsers(field: string, text: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/searchUsers?field=${field}&text=${text}`,
      this.getHttpOptions()
    );
  }
}
