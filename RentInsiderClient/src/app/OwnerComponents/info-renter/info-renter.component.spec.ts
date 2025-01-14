import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRenterComponent } from './info-renter.component';

describe('InfoRenterComponent', () => {
  let component: InfoRenterComponent;
  let fixture: ComponentFixture<InfoRenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoRenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
