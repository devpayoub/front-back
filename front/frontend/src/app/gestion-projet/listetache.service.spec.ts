import { TestBed } from '@angular/core/testing';

import { ListetacheService } from './listetache.service';

describe('ListetacheService', () => {
  let service: ListetacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListetacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
