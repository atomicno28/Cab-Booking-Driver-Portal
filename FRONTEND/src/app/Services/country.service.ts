import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  addCountry(country: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/addCountry`,
      country,
      this.getHttpOptions()
    );
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getCountries`,
      this.getHttpOptions()
    );
  }
}
