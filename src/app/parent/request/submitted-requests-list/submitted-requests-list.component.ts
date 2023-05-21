import {Component, OnInit} from '@angular/core';

import jwt_decode from "jwt-decode";

import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {IExtensionRequest, IRegistrationRequest} from "../../../shared/models/IRequest";
import {AccountService} from "../../../services/account/account.service";



@Component({
  selector: 'app-submitted-requests-list',
  templateUrl: './submitted-requests-list.component.html',
  styleUrls: ['./submitted-requests-list.component.scss']
})
export class SubmittedRequestsListComponent implements OnInit {
  registrationRequestList!: IRegistrationRequest[];
  extensionRequestList!: IExtensionRequest[];
  id!: number;
  private secretKey: string = 'rU3x5y7A9dG!KkP*';


  constructor(
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService,
    private _accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.id = jwt_decode(this._accountService.getAuthenticatedToken())['id'];
    this._registrationRequestService.getAllForParent(this.id).subscribe(data => this.registrationRequestList = data);
    this._extensionRequestService.getAllForParent(this.id).subscribe(data => this.extensionRequestList = data);
  }
}
