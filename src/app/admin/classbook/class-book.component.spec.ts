import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBookComponent } from './class-book.component';

describe('ClassbookComponent', () => {
  let component: ClassBookComponent;
  let fixture: ComponentFixture<ClassBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
