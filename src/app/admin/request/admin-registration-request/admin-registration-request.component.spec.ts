import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrationRequestComponent } from './admin-registration-request.component';

describe('AdminRegistrationRequestComponent', () => {
  let component: AdminRegistrationRequestComponent;
  let fixture: ComponentFixture<AdminRegistrationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRegistrationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegistrationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
