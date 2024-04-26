import { Component, OnInit } from '@angular/core';
import { CountryService } from '../Services/country.service';

@Component({
  selector: 'app-vehiclepricing',
  templateUrl: './vehiclepricing.component.html',
  styleUrls: ['./vehiclepricing.component.css'],
})
export class VehiclepricingComponent implements OnInit {
  existingCountry = [];
  vehicleType = ['Sedan', 'SUV', 'Minivan', 'Electric', 'Hybrid'];
  selectedCountry: any;

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.countryService.getCountries().subscribe((countries) => {
      this.existingCountry = countries.map((country) => ({
        name: country.Name,
        city: country.City,
        countryCode: country.CountryCode,
      }));
    });
  }

  onCountryChange(countryName: string) {
    this.selectedCountry = this.existingCountry.find(
      (country) => country.name === countryName
    );
  }
}
