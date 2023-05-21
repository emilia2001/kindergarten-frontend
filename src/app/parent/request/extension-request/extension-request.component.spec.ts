import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionRequestComponent } from './extension-request.component';

describe('ExtensionRequestComponent', () => {
  let component: ExtensionRequestComponent;
  let fixture: ComponentFixture<ExtensionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtensionRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
