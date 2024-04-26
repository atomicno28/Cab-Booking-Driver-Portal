import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VehicletypeComponent } from './vehicletype/vehicletype.component';
import { CountryComponent } from './country/country.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CityComponent } from './city/city.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { VehiclepricingComponent } from './vehiclepricing/vehiclepricing.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';
import { DriverComponent } from './driverlist/driverlist.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VehicletypeComponent,
    CountryComponent,
    CityComponent,
    VehiclepricingComponent,
    SettingsComponent,
    UserComponent,
    DriverComponent,
    HomeComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
