import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenterDetailsComponent } from './renter-details.component';

describe('RenterDetailsComponent', () => {
  let component: RenterDetailsComponent;
  let fixture: ComponentFixture<RenterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
