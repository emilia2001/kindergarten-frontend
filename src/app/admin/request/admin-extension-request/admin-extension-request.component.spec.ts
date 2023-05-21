import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExtensionRequestComponent } from './admin-extension-request.component';

describe('AdminExtensionRequestComponent', () => {
  let component: AdminExtensionRequestComponent;
  let fixture: ComponentFixture<AdminExtensionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminExtensionRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExtensionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
