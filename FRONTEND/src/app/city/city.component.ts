import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit,
} from '@angular/core';
import { CityService } from '../Services/city.service'; // Import CityService

declare var google: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
})
export class CityComponent implements AfterViewInit, OnInit {
  @ViewChild('zoneInput') zoneInput: ElementRef;
  savedCountry = [];
  selectedCountry = null; // Don't set a default country
  selectedCity: string; // The selected city
  autocomplete: any; // Declare autocomplete here
  responseMessage: string;

  constructor(private ngZone: NgZone, private cityService: CityService) {} // Inject CityService

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.cityService.getCountries().subscribe((countries) => {
      this.savedCountry = countries.map((country) => ({
        Name: country.Name,
        CountryCode: country.CountryCode,
      }));
    });
  }

  ngAfterViewInit() {
    this.setupAutocomplete(); // Call setupAutocomplete here
  }

  setupAutocomplete() {
    if (this.selectedCountry) {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.zoneInput.nativeElement,
        {
          types: ['(cities)'], // Restrict the search to city names
          componentRestrictions: { country: this.selectedCountry.CountryCode }, // Restrict the search to the selected country
        }
      );

      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place = this.autocomplete.getPlace();
          this.selectedCity = place.name;
        });
      });
    }
  }

  onCountryChange(countryName: string) {
    this.selectedCountry = this.savedCountry.find(
      (country) => country.Name === countryName
    );
    if (!this.autocomplete) {
      this.setupAutocomplete();
    } else {
      this.autocomplete.setComponentRestrictions({
        country: this.selectedCountry.CountryCode,
      });
    }
  }

  addZone() {
    if (this.selectedCountry) {
      this.cityService
        .addCity({
          country: this.selectedCountry.Name,
          city: this.selectedCity,
        })
        .subscribe(
          (response) => {
            this.responseMessage = 'City added successfully';
            this.loadCountries(); // Reload the countries after successful addition
          },
          (error) => {
            console.error('Error adding city', error);
            if (error.status === 400) {
              this.responseMessage = 'Error: ' + error.error.error;
            } else if (error.status === 403) {
              this.responseMessage = 'Error: Token not verified';
            } else {
              this.responseMessage = 'Error adding city';
            }
          }
        );
    }
  }
}
