import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CityService } from '../Services/city.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:3000/user';
  constructor(private http: HttpClient, private cityService: CityService) {}

  getHttpOptions(): any {
    return this.cityService.getHttpOptions();
  }

  addDriver(driver: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/addDriver`,
      driver,
      this.getHttpOptions()
    );
  }

  getDrivers(page: number, limit: number, sortField?: string): Observable<any> {
    let url = `${this.apiUrl}/getDrivers?page=${page}&limit=${limit}`;
    if (sortField) {
      url += `&sortField=${sortField}`;
    }
    return this.http.get<any>(url, this.getHttpOptions());
  }

  updateDriver(driver: any, id: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateDriver/${id}`,
      driver,
      this.getHttpOptions()
    );
  }

  deleteDriver(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/deleteDriver/${id}`,
      this.getHttpOptions()
    );
  }

  searchDrivers(field: string, text: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/searchDrivers?field=${field}&text=${text}`,
      this.getHttpOptions()
    );
  }
}
