import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPaymentListComponent } from './parent-payment-list.component';

describe('ParentPaymentListComponent', () => {
  let component: ParentPaymentListComponent;
  let fixture: ComponentFixture<ParentPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
