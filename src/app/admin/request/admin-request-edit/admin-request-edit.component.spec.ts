import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestEditComponent } from './admin-request-edit.component';

describe('RequestEditComponent', () => {
  let component: AdminRequestEditComponent;
  let fixture: ComponentFixture<AdminRequestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRequestEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
