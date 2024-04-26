import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclepricingComponent } from './vehiclepricing.component';

describe('VehiclepricingComponent', () => {
  let component: VehiclepricingComponent;
  let fixture: ComponentFixture<VehiclepricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiclepricingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiclepricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
