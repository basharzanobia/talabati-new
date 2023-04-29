import { TestBed } from '@angular/core/testing';

import { RouteInterceptorServiceService } from './route-interceptor-service.service';

describe('RouteInterceptorServiceService', () => {
  let service: RouteInterceptorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteInterceptorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
