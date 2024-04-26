import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../Services/country.service'; // Import the CountryService
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit {
  country = '';
  currency = '';
  countryCode = '';
  callingCode = '';
  validationMessage = ''; // Add a validation message property
  searchText = ''; // Add a search text property

  countryData: any;

  countries: any[] = []; // Add a countries property

  //suggestions...
  countrySuggestions: any[] = [];

  constructor(
    // private authService: AuthService,
    private modalService: NgbModal,
    private http: HttpClient,
    private countryService: CountryService
  ) {} // Inject the CountryService

  ngOnInit(): void {
    // Load countries on initialization
    this.loadCountries();
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // fetch the other details such as the inputs is getting changed from the input field...
  onCountryChange(value: string) {
    this.http
      .get(`https://restcountries.com/v3.1/name/${value}`)
      .subscribe((data: any[]) => {
        this.countrySuggestions = data;
      });
  }

  // Storing the newly country...
  // Storing the new country...
  addCountry() {
    if (
      !this.country ||
      !this.currency ||
      !this.countryCode ||
      !this.callingCode
    ) {
      this.validationMessage = 'Please fill all the fields.';
      return;
    }

    // Prepare the country data
    const countryData = {
      Name: this.country,
      Currency: this.currency,
      CountryCode: this.countryCode,
      CountryCallingCode: this.callingCode,
      TimeZone: this.countryData.timezones[0], // assuming timezones is an array
      City: [], // Initialize the city array as empty
    };

    // Call the service to add the country
    this.countryService.addCountry(countryData).subscribe(
      (response) => {
        console.log(response);
        // Clear the fields
        this.country = '';
        this.currency = '';
        this.countryCode = '';
        this.callingCode = '';
        this.validationMessage = '';

        // Close the modal
        this.modalService.dismissAll();

        // Load the updated list of countries
        this.loadCountries();
      },
      (error) => {
        console.error(error);
        if (error.status === 400) {
          this.validationMessage = 'This country already exists.';
        } else if (error.status === 401) {
          this.validationMessage = 'Access Denied. Please login again.';
        } else if (error.status === 403) {
          this.validationMessage = 'Token not verified. Please login again.';
        } else {
          this.validationMessage = 'An error occurred. Please try again.';
        }
      }
    );
  }

  // Method to load countries from the server
  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (response) => {
        this.countries = response;
      },
      (error) => {
        console.error(error);
        if (error.status === 401) {
          this.validationMessage = 'Access Denied. Please login again.';
        } else if (error.status === 403) {
          // Add the code for logout.................
          this.validationMessage = 'Token not verified. Please login again.';
        } else {
          this.validationMessage = 'An error occurred. Please try again.';
        }
      }
    );
  }

  // Once the country is picked, then autofill rest other fields..
  onCountrySelect(country: any) {
    this.countryData = country;
    this.country = country.name.common;
    this.currency = Object.keys(country.currencies)[0];
    this.countryCode = country.cca2;
    this.callingCode = country.idd.root + country.idd.suffixes[0];
  }
}
