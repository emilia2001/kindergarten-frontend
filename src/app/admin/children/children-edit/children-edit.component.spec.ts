import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenEditComponent } from './children-edit.component';

describe('ChildrenEditComponent', () => {
  let component: ChildrenEditComponent;
  let fixture: ComponentFixture<ChildrenEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildrenEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildrenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
