import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../Services/user.service';

declare var google: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements AfterViewInit {
  Users: any[] = [];
  totalUsers: number;
  updateId: string;
  page = 1;
  sortField: string;

  newUser = {
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
    private userService: UserService
  ) {}

  canGoPrev(): boolean {
    return this.page > 1;
  }

  canGoNext(): boolean {
    const totalPages = Math.ceil(this.totalUsers / 4);
    return this.page < totalPages;
  }

  Prev() {
    this.page -= 1;
    this.fetchUsers();
  }
  Next() {
    this.page += 1;
    this.fetchUsers();
  }

  fetchUsers(sortField?: string) {
    this.userService.getUsers(this.page, 4, sortField).subscribe(
      (response) => {
        this.Users = response.users; // replace the existing data
        this.totalUsers = response.totalUsers;
        console.log(this.Users);
        console.log(this.totalUsers);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  sortAndLoadCountries(field: string) {
    this.fetchUsers(field);
  }

  // Function to add a new user
  addUser() {
    if (
      !this.newUser.name ||
      !this.newUser.email ||
      !this.newUser.phone ||
      !this.newUser.countrycode
    ) {
      this.errorMessage = 'All fields are required.';
      this.showErrors = true;
      return;
    }

    if (!this.validateEmail(this.newUser.email)) {
      this.errorMessage = 'Invalid email format.';
      this.showErrors = true;
      return;
    }

    if (!this.validatePhone(this.newUser.phone)) {
      this.errorMessage = 'Invalid phone number format.';
      this.showErrors = true;
      return;
    }

    if (this.editing) {
      this.updateUser();
    } else {
      this.userService.addUser(this.newUser).subscribe(
        (response) => {
          console.log(response);
          this.fetchUsers(); // fetch users after successful operation
          this.reset();
          this.newUser.countrycode = '';
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
    this.newUser.name = '';
    this.newUser.email = '';
    this.newUser.phone = '';
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        if ((this.totalUsers - 1) % 4 === 0 && this.page > 1) {
          this.page -= 1;
        }
        this.fetchUsers(); // fetch users after successful operation
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

  // Function to edit a user
  editUser(id: string) {
    const user = this.Users.find((user) => user._id === id);
    if (user) {
      this.newUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        countrycode: user.countrycode,
      };
      this.editing = true;
      this.updateId = id;
    }
  }
  updateUser() {
    if (
      !this.newUser.name ||
      !this.newUser.email ||
      !this.newUser.phone ||
      !this.newUser.countrycode
    ) {
      this.errorMessage = 'All fields are required.';
      this.showErrors = true;
      return;
    }

    if (!this.validateEmail(this.newUser.email)) {
      this.errorMessage = 'Invalid email format.';
      this.showErrors = true;
      return;
    }

    if (!this.validatePhone(this.newUser.phone)) {
      this.errorMessage = 'Invalid phone number format.';
      this.showErrors = true;
      return;
    }

    this.userService.updateUser(this.newUser, this.updateId).subscribe(
      (response) => {
        console.log(response);
        this.fetchUsers(); // fetch users after successful operation
        this.editing = false; // exit edit mode
        this.reset(); // reset the form
        this.newUser.countrycode = '';
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
      this.newUser.countrycode = country ? country.code : '';
    });
  }

  ngOnInit() {
    this.fetchUsers();
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
    this.userService.searchUsers(this.searchField, this.searchText).subscribe(
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
