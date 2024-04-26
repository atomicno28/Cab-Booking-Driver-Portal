import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000/user'; // replace with your backend URL
  private username = new BehaviorSubject<string>(
    this.getUsernameFromLocalStorage()
  );
  private token = new BehaviorSubject<string>(this.getTokenFromLocalStorage());

  constructor(private http: HttpClient) {}

  getUsernameFromLocalStorage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('username') || '';
    }
    return '';
  }

  setUsername(name: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('username', name);
    }
    this.username.next(name);
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getTokenFromLocalStorage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
    this.token.next(token);
  }

  getToken(): Observable<string> {
    return this.token.asObservable();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { username, password });
  }
  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.url}/validateToken`, { token });
  }
}
