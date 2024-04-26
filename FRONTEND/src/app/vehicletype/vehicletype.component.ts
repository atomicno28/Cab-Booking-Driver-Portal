import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../Services/vehicles.service';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehicletype.component.html',
  styleUrls: ['./vehicletype.component.css'],
})
export class VehicletypeComponent implements OnInit {
  vehicleType: string = '';
  vehicleName: string = '';
  selectedIconFile: File | null = null;
  selectedIconBase64: string | null = null;

  nameError: string = '';
  typeError: string = '';
  iconError: string = '';
  serverError: string = '';

  vehicles: any[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (vehicles) => {
        this.vehicles = vehicles;
        console.log(this.vehicles);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  addVehicle() {
    this.nameError = '';
    this.typeError = '';
    this.iconError = '';
    this.serverError = '';

    if (this.vehicleType === '') {
      this.typeError = 'Please select a vehicle type.';
      return;
    }

    if (this.vehicleName.trim() === '') {
      this.nameError = 'Please enter a name for the vehicle.';
      return;
    }

    if (!this.selectedIconFile) {
      this.iconError = 'Please choose an icon for the vehicle.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedIconBase64 = reader.result as string;

      const vehicle = {
        vehicleTypes: this.vehicleType,
        name: this.vehicleName,
        logo: this.selectedIconBase64,
      };

      this.vehicleService.addVehicle(vehicle).subscribe(
        (res) => {
          this.vehicleType = '';
          this.vehicleName = '';
          this.selectedIconFile = null;
          this.selectedIconBase64 = null;
          this.loadVehicles(); // Reload vehicles after adding a new one
        },
        (err) => {
          console.error(err);
          this.serverError = err.error.error; // Set the server error
        }
      );
    };
    reader.readAsDataURL(this.selectedIconFile);
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024; // size in KB
      if (fileSize > 100) {
        this.iconError = 'The file size should not exceed 100 KB.';
        return;
      }
      this.selectedIconFile = file;

      // Read the selected file as a base64 string
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedIconBase64 = reader.result as string;
      };
      reader.readAsDataURL(this.selectedIconFile);
    }
  }

  editVehicle(vehicleId: string) {
    const vehicle = this.vehicles.find((v) => v._id === vehicleId);
    if (vehicle) {
      this.vehicleType = vehicle.vehicleTypes;
      this.vehicleName = vehicle.name;
      this.selectedIconBase64 = vehicle.logo;
      this.selectedIconFile = null; // Clear the selected file
    }
  }

  updateVehicle(vehicleId: string) {
    const vehicle = {
      vehicleTypes: this.vehicleType,
      name: this.vehicleName,
      logo: this.selectedIconBase64,
    };

    this.vehicleService.updateVehicle(vehicleId, vehicle).subscribe(
      (res) => {
        // Clear the form fields after successful update
        this.vehicleType = '';
        this.vehicleName = '';
        this.selectedIconFile = null;
        this.selectedIconBase64 = null;
        this.loadVehicles(); // Reload vehicles after updating
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
