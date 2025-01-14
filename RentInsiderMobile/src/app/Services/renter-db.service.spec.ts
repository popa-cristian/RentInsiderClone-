import { TestBed } from '@angular/core/testing';

import { RenterDbService } from './renter-db.service';

describe('RenterDbService', () => {
  let service: RenterDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenterDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
