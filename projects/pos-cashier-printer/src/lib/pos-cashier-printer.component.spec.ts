import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCashierPrinterComponent } from './pos-cashier-printer.component';

describe('PosCashierPrinterComponent', () => {
  let component: PosCashierPrinterComponent;
  let fixture: ComponentFixture<PosCashierPrinterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosCashierPrinterComponent]
    });
    fixture = TestBed.createComponent(PosCashierPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
