// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { VehicletypeComponent } from './vehicletype/vehicletype.component';
import { VehiclepricingComponent } from './vehiclepricing/vehiclepricing.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';
import { DriverComponent } from './driverlist/driverlist.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'country', component: CountryComponent },
  { path: 'city', component: CityComponent },
  { path: 'vehicle-type', component: VehicletypeComponent },
  { path: 'vehicle-pricing', component: VehiclepricingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'user', component: UserComponent },
  { path: 'driver-list', component: DriverComponent },
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
