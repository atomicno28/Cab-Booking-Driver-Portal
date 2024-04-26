import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders();
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  addVehicle(vehicle: any): Observable<any> {
    const vehicleData = {
      vehicleTypes: vehicle.vehicleTypes,
      name: vehicle.name,
      logo: vehicle.logo,
    };

    return this.http.post<any>(
      `${this.apiUrl}/addVehicle`,
      vehicleData,
      this.getHttpOptions()
    );
  }

  getVehicles(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getVehicles`,
      this.getHttpOptions()
    );
  }

  updateVehicle(vehicleId: string, vehicle: any): Observable<any> {
    const vehicleData = {
      vehicleId,
      vehicleTypes: vehicle.vehicleTypes,
      name: vehicle.name,
      logo: vehicle.logo,
    };

    return this.http.put<any>(
      `${this.apiUrl}/updateVehicle`,
      vehicleData,
      this.getHttpOptions()
    );
  }
}
