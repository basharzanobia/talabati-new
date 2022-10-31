import { TestBed } from '@angular/core/testing';

import { EditAddressService } from './edit-address.service';

describe('EditAddressService', () => {
  let service: EditAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
