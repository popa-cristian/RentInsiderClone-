import { TestBed } from '@angular/core/testing';

import { RenterDBService } from './renter-db.service';

describe('RenterDBService', () => {
  let service: RenterDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenterDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
