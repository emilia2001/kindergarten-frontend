import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentRequestEditComponent } from './parent-request-edit.component';

describe('EditRequestComponent', () => {
  let component: ParentRequestEditComponent;
  let fixture: ComponentFixture<ParentRequestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentRequestEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
