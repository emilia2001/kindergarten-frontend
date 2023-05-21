import { TestBed } from '@angular/core/testing';

import { ExtensionRequestService } from './extension-request.service';

describe('ExtensionRequestService', () => {
  let service: ExtensionRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
