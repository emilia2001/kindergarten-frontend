import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentListComponent } from './admin-payment-list.component';

describe('PaymentListComponent', () => {
  let component: AdminPaymentListComponent;
  let fixture: ComponentFixture<AdminPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
