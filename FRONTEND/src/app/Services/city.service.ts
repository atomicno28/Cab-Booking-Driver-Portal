import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { CountryService } from '../Services/country.service'; // Import CountryService

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private countryService: CountryService
  ) {} // Inject CountryService

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  getCountries(): Observable<any> {
    return this.countryService.getCountries(); // Use getCountries from CountryService
  }

  addCity(city: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/addCity`,
      city,
      this.getHttpOptions()
    );
  }
}
