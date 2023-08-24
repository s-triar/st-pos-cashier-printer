import { TestBed } from '@angular/core/testing';

import { PosCashierPrinterService } from './pos-cashier-printer.service';

describe('PosCashierPrinterService', () => {
  let service: PosCashierPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosCashierPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
