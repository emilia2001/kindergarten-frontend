import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {IExtensionRequest, IRegistrationRequest} from "../../../shared/models/IRequest";

@Component({
  selector: 'app-parent-request-edit',
  templateUrl: './parent-request-edit.component.html',
  styleUrls: ['./parent-request-edit.component.scss']
})
export class ParentRequestEditComponent implements OnInit {
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  isLoading: any;
  requestType!: string | null;
  idParam!: string | null;
  comments!: string | null;
  registrationRequest!: IRegistrationRequest;
  extensionRequest!: IExtensionRequest;
  isClosed: any;
  showSuccessAlert: any;
  showErrorAlert: any;
  isLoadingUpdate: boolean = false;
  updateMessage: string = '';


  constructor(
    private _route: ActivatedRoute,
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService,
  ) {}

  ngOnInit(): void {
    this.idParam = this._route.snapshot.paramMap.get('id');
    this._route.queryParams.subscribe(params => {
      this.requestType = params['type'];
      this.comments = params['comments'];
      this.isLoading = true;
      if (this.requestType == 'registration')
        this._registrationRequestService.getOneById(Number.parseInt(this.idParam!)).subscribe(data => {
          this.registrationRequest = data;
          this.isClosed = data.status.toString() == 'APPROVED' || data.status.toString() == 'REJECTED';
          this.isLoading = false;
        });
      if (this.requestType == 'extension')
        this._extensionRequestService.getOneById(Number.parseInt(this.idParam!)).subscribe(data => {
          this.extensionRequest = data;
          this.isClosed = data.status.toString() == 'APPROVED' || data.status.toString() == 'REJECTED';
          this.isLoading = false;

        });
    });

  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }

  closeErrorAlert() {
    this.showErrorAlert = false;
  }

  scrollToSuccessAlert() {
    console.log(this.successAlertRef)
    if (this.successAlertRef && this.successAlertRef.nativeElement) {
      this.successAlertRef.nativeElement.scrollIntoView({behavior: 'smooth'});
      this.successAlertRef.nativeElement.focus();
    }
  }

  scrollToErrorAlert() {
    if (this.errorAlertRef && this.errorAlertRef.nativeElement) {
      this.errorAlertRef.nativeElement.scrollIntoView({behavior: 'smooth'});
    }
  }

  handleSubmitForm($event: any) {
    this.showErrorAlert = false;
    this.showSuccessAlert = false;
    this.updateMessage = $event["message"];
    if ($event["type"] == "success") {
      this.showSuccessAlert = true;
      setTimeout(() => this.scrollToSuccessAlert(), 0);
    }
    if ($event["type"] == "error") {
      this.showErrorAlert = true;
      setTimeout(() => this.scrollToErrorAlert(), 0);
    }
  };

}
