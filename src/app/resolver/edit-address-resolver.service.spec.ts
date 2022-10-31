import { TestBed } from '@angular/core/testing';

import { EditAddressResolverService } from './edit-address-resolver.service';

describe('EditAddressResolverService', () => {
  let service: EditAddressResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAddressResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
