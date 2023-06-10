import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentRequestsListComponent } from './parent-requests-list.component';

describe('SubmittedRequestsListComponent', () => {
  let component: ParentRequestsListComponent;
  let fixture: ComponentFixture<ParentRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentRequestsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
