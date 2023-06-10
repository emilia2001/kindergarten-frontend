import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentRegistrationRequestComponent } from './parent-registration-request.component';

describe('RegistrationRequestComponent', () => {
  let component: ParentRegistrationRequestComponent;
  let fixture: ComponentFixture<ParentRegistrationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentRegistrationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentRegistrationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
