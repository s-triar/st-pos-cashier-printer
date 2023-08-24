import { TestBed } from '@angular/core/testing';

import { PosCashierImagePrintManagerService } from './pos-cashier-image-print-manager.service';

describe('PosCashierImagePrintManagerService', () => {
  let service: PosCashierImagePrintManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosCashierImagePrintManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
