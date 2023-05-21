import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationRequestComponent } from './registration-request.component';

describe('RegistrationRequestComponent', () => {
  let component: RegistrationRequestComponent;
  let fixture: ComponentFixture<RegistrationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
