import { TestBed } from '@angular/core/testing';

import { PaymentConfirmationService } from './payment-confirmation.service';

describe('PaymentConfirmationService', () => {
  let service: PaymentConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
