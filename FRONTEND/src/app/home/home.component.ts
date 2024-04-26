import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Username = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsername().subscribe((username) => {
      this.Username = username;
    });
  }
}
