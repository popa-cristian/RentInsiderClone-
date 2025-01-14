import { TestBed } from '@angular/core/testing';

import { PropertyService } from './property.service';

describe('AddPropertyServiceService', () => {
  let service: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
