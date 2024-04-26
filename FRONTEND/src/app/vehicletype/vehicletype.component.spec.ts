import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicletypeComponent } from './vehicletype.component';

describe('VehicletypeComponent', () => {
  let component: VehicletypeComponent;
  let fixture: ComponentFixture<VehicletypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicletypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicletypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
