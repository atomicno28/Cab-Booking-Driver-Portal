import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { DriverService } from '../Services/driver.service';

declare var google: any;

@Component({
  selector: 'app-driver',
  templateUrl: './driverlist.component.html',
  styleUrls: ['./driverlist.component.css'],
})
export class DriverComponent implements AfterViewInit {
  Drivers: any[] = [];
  totalDrivers: number;
  updateId: string;
  page = 1;
  sortField: string;

  newDriver = {
    name: '',
    email: '',
    phone: '',
    countrycode: '',
  };

  showErrors = false;
  errorMessage = '';

  editing = false;
  editingIndex: number;

  autocomplete: any;
  countries: any[] = [];

  searchField = 'NotSet';
  searchText = '';
  searchResults: any[] = [];
  searched = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private driverService: DriverService
  ) {}

  canGoPrev(): boolean {
    return this.page > 1;
  }

  canGoNext(): boolean {
    const totalPages = Math.ceil(this.totalDrivers / 4);
    return this.page < totalPages;
  }

  Prev() {
    this.page -= 1;
    this.fetchDrivers();
  }
  Next() {
    this.page += 1;
    this.fetchDrivers();
  }

  fetchDrivers(sortField?: string) {
    this.driverService.getDrivers(this.page, 4, sortField).subscribe(
      (response) => {
        this.Drivers = response.drivers; // replace the existing data
        this.totalDrivers = response.totalDrivers;
        console.log(this.Drivers);
        console.log(this.totalDrivers);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  sortAndLoadCountries(field: string) {
    this.fetchDrivers(field);
  }

  // Function to add a new driver
  addDriver() {
    if (
      !this.newDriver.name ||
      !this.newDriver.email ||
      !this.newDriver.phone ||
      !this.newDriver.countrycode
    ) {
      this.errorMessage = 'All fields are required.';
      this.showErrors = true;
      return;
    }

    if (!this.validateEmail(this.newDriver.email)) {
      this.errorMessage = 'Invalid email format.';
      this.showErrors = true;
      return;
    }

    if (!this.validatePhone(this.newDriver.phone)) {
      this.errorMessage = 'Invalid phone number format.';
      this.showErrors = true;
      return;
    }

    if (this.editing) {
      this.updateDriver();
    } else {
      this.driverService.addDriver(this.newDriver).subscribe(
        (response) => {
          console.log(response);
          this.fetchDrivers(); // fetch drivers after successful operation
          this.reset();
          this.newDriver.countrycode = '';
          this.showErrors = false; // reset error flag
          this.errorMessage = ''; // reset error message
        },
        (error) => {
          console.error(error);
          if (error.status === 400) {
            this.errorMessage = error.error.error;
            this.showErrors = true;
          }
        }
      );
    }
  }
  validateEmail(email) {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone) {
    let re = /^\d{10}$/;
    return re.test(String(phone));
  }

  reset() {
    this.newDriver.name = '';
    this.newDriver.email = '';
    this.newDriver.phone = '';
  }

  deleteDriver(id: string) {
    this.driverService.deleteDriver(id).subscribe(
      (response) => {
        if ((this.totalDrivers - 1) % 4 === 0 && this.page > 1) {
          this.page -= 1;
        }
        this.fetchDrivers(); // fetch drivers after successful operation
      },
      (error) => {
        console.error(error);
        if (error.status === 400) {
          this.errorMessage = error.error.error;
          this.showErrors = true;
        }
      }
    );
  }

  // Function to edit a driver
  editDriver(id: string) {
    const driver = this.Drivers.find((driver) => driver._id === id);
    if (driver) {
      this.newDriver = {
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        countrycode: driver.countrycode,
      };
      this.editing = true;
      this.updateId = id;
    }
  }
  updateDriver() {
    if (
      !this.newDriver.name ||
      !this.newDriver.email ||
      !this.newDriver.phone ||
      !this.newDriver.countrycode
    ) {
      this.errorMessage = 'All fields are required.';
      this.showErrors = true;
      return;
    }

    if (!this.validateEmail(this.newDriver.email)) {
      this.errorMessage = 'Invalid email format.';
      this.showErrors = true;
      return;
    }

    if (!this.validatePhone(this.newDriver.phone)) {
      this.errorMessage = 'Invalid phone number format.';
      this.showErrors = true;
      return;
    }

    this.driverService.updateDriver(this.newDriver, this.updateId).subscribe(
      (response) => {
        console.log(response);
        this.fetchDrivers(); // fetch drivers after successful operation
        this.editing = false; // exit edit mode
        this.reset(); // reset the form
        this.newDriver.countrycode = '';
        this.showErrors = false; // reset error flag
        this.errorMessage = ''; // reset error message
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error.error;
          this.showErrors = true;
        }
      }
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAutocomplete();
    }
  }

  initAutocomplete() {
    const input = document.getElementById('country');
    const options = {
      types: ['(regions)'], // this should restrict the search to geographical regions
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      const country = this.countries.find((c) => c.name === place.name);
      this.newDriver.countrycode = country ? country.code : '';
    });
  }

  ngOnInit() {
    this.fetchDrivers();
    this.http
      .get('https://restcountries.com/v3.1/all')
      .subscribe((data: any[]) => {
        this.countries = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
      });
  }
  // Add this method
  search() {
    this.driverService
      .searchDrivers(this.searchField, this.searchText)
      .subscribe(
        (response) => {
          this.searchResults = response;
        },
        (error) => {
          console.error(error);
        }
      );
    this.searched = true;
  }
}
