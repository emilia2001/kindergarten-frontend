import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedRequestsListComponent } from './submitted-requests-list.component';

describe('SubmittedRequestsListComponent', () => {
  let component: SubmittedRequestsListComponent;
  let fixture: ComponentFixture<SubmittedRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittedRequestsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
