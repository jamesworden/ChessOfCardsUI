import { TestBed } from '@angular/core/testing';

import { ResponsiveSizeService } from './responsive-size.service';

describe('ResponsiveSizeService', () => {
  let service: ResponsiveSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
