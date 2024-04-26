import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  Register = { username: '', password: '', errorMessage: '' };
  Login = { username: '', password: '', errorMessage: '' };
  isUserLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isUserLoggedIn = true;
      }
    }
  }

  register() {
    if (!this.Register.username) {
      this.Register.errorMessage = 'You must enter the username.';
      return;
    }
    if (!this.Register.password) {
      this.Register.errorMessage = 'You must enter the password.';
      return;
    }

    this.authService
      .register(this.Register.username, this.Register.password)
      .subscribe(
        (response) => {
          // Removed the token setting part
          this.Register.errorMessage = '';
          this.Register.username = '';
          this.Register.password = '';
          alert('User Registered Successfully...');
        },
        (error) => {
          if (error.status === 400) {
            this.Register.errorMessage = 'Username already exists';
          } else {
            this.Register.errorMessage = error.error.error;
          }
          console.error(error);
        }
      );
  }

  login() {
    if (!this.Login.username) {
      this.Login.errorMessage = 'You must enter the username.';
      return;
    }
    if (!this.Login.password) {
      this.Login.errorMessage = 'You must enter the password.';
      return;
    }

    this.authService.login(this.Login.username, this.Login.password).subscribe(
      (response) => {
        if (response.token) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('token', response.token);
          }
          this.authService.setUsername(this.Login.username);
          this.Login.errorMessage = '';
          this.isUserLoggedIn = true; // Show sidebar on successful login
          this.Login.username = '';
          this.Login.password = '';
          console.log('Logged in successfully');
        }
      },
      (error) => {
        if (error.status === 400) {
          this.Login.errorMessage = 'Username does not exist.';
        } else if (error.status === 401) {
          this.Login.errorMessage = 'Password is incorrect.';
        } else {
          this.Login.errorMessage = 'Error logging in user';
        }
        console.error(error);
      }
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.isUserLoggedIn = false; // Hide sidebar on logout
    console.log('Logged out successfully');
  }
}
