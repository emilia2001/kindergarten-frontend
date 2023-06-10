import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import jwt_decode from "jwt-decode";

import {AccountService} from "../../../services/account/account.service";

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {
  isLoading: any;
  form: any;
  currentApplicationPdf!: string;
  requestType!: string;
  showSuccessAlert: any;
  showErrorAlert: any;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  isLoadingUpdate: boolean = false;
  updateMessage: string = '';

  constructor(
    private _accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    var id = jwt_decode(this._accountService.getAuthenticatedToken())['id'];
    this.currentApplicationPdf = "https://firebasestorage.googleapis.com/v0/b/kindergarten-management-3ca8d.appspot.com/o/uploads%2Frequests%2Fregistration%2FCerere-tip-inscriere-invatamant-prescolar-2022-2023.pdf?alt=media&token=55a89ab0-9e62-48dd-b87f-8a4d8f6a6883";
    this.requestType = 'registration';
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.currentApplicationPdf;
    link.target = 'blank';
    link.download = 'document.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }


  handleTypeChange($event: any) {
    switch ($event.target.value) {
      case 'registration' :
        this.currentApplicationPdf = "https://firebasestorage.googleapis.com/v0/b/kindergarten-management-3ca8d.appspot.com/o/uploads%2Frequests%2Fregistration%2FCerere-tip-inscriere-invatamant-prescolar-2022-2023.pdf?alt=media&token=55a89ab0-9e62-48dd-b87f-8a4d8f6a6883";
        this.requestType = 'registration';
        break;
      case 'extension':
        this.currentApplicationPdf = "https://firebasestorage.googleapis.com/v0/b/kindergarten-management-3ca8d.appspot.com/o/uploads%2Frequests%2Fextension%2FCerere-inscriere-pe-perioada-vacantei-2.pdf?alt=media&token=fae5cde9-3c78-49e8-b622-9edd6d53ee80"
        this.requestType = 'extension';
    }
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
      // or use this.successAlertRef.nativeElement.focus();
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
