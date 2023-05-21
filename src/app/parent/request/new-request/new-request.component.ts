import {Component, OnInit} from '@angular/core';

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
}
