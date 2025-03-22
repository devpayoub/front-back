import { TestBed } from '@angular/core/testing';

import { PlanactionService } from './planaction.service';

describe('PlanactionService', () => {
  let service: PlanactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
