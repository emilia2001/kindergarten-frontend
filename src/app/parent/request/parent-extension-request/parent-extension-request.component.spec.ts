import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentExtensionRequestComponent } from './parent-extension-request.component';

describe('ExtensionRequestComponent', () => {
  let component: ParentExtensionRequestComponent;
  let fixture: ComponentFixture<ParentExtensionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentExtensionRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentExtensionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
