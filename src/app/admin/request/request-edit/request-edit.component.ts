import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";

import {GroupService} from "../../../services/group/group.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {AccountService} from "../../../services/account/account.service";
import {ERequestStatus, IExtensionRequest, IRegistrationRequest} from "../../../shared/models/IRequest";
import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {IGroupSpotsDto} from "../../../shared/models/IGroup";

@Component({
  selector: 'app-request-edit',
  templateUrl: './request-edit.component.html',
  styleUrls: ['./request-edit.component.scss']
})
export class RequestEditComponent implements OnInit {
  isLoading!: boolean;
  requestType!: string;
  registrationRequest!: IRegistrationRequest;
  extensionRequest!: IExtensionRequest;
  comments!: string;
  idParam!: number;
  groupSpots!: IGroupSpotsDto;
  isClosed: any;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService,
    private _firebaseService: FirebaseService,
    private _accountService: AccountService,
  ) {
  }

  ngOnInit(): void {
    this.idParam = +this._route.snapshot.paramMap.get('id')!;
    this.requestType = this._route.snapshot.paramMap.get('type')!;
    this.isLoading = true;
    if (this.requestType == 'registration')
      this._registrationRequestService.getOneById(this.idParam).subscribe(data => {
        this.registrationRequest = data;
        this.isClosed = data.status.toString() == 'APPROVED' || data.status.toString() == 'REJECTED';
        this._groupService.getSpotsInformationById(data.child.group.id!).subscribe(data => {
          this.groupSpots = data
          this.isLoading = false;
        })
      });
    if (this.requestType == 'extension')
      this._extensionRequestService.getOneById(this.idParam).subscribe(data => {
        this.extensionRequest = data;
        this.isClosed = data.status.toString() == 'APPROVED' || data.status.toString() == 'REJECTED';
        this._groupService.getSpotsInformationById(data.child.group.id!).subscribe(data => {
          this.groupSpots = data
          this.isLoading = false;
        })
      });
  }

  addComment() {
    if (this.requestType == 'registration'){
      this.registrationRequest.status = ERequestStatus.ONGOING;
      this._registrationRequestService.updateRequest(this.registrationRequest).subscribe(data => console.log(data));
    }
    if (this.requestType == 'extension') {
      this.extensionRequest.status = ERequestStatus.ONGOING;
      this._extensionRequestService.updateRequest(this.extensionRequest).subscribe(data => console.log(data));
    }
  }


  approveRequest() {
    if (this.requestType == 'registration'){
      this.registrationRequest.status = ERequestStatus.APPROVED;
      this._registrationRequestService.updateRequest(this.registrationRequest).subscribe(data => console.log(data));
    }
    if (this.requestType == 'extension') {
      this.extensionRequest.status = ERequestStatus.APPROVED;
      this._extensionRequestService.updateRequest(this.extensionRequest).subscribe(data => console.log(data));
    }
  }

  rejectRequest() {
    if (this.requestType == 'registration'){
      this.registrationRequest.status = ERequestStatus.REJECTED;
      this._registrationRequestService.updateRequest(this.registrationRequest).subscribe(data => console.log(data));
    }
    if (this.requestType == 'extension') {
      this.extensionRequest.status = ERequestStatus.REJECTED;
      this._extensionRequestService.updateRequest(this.extensionRequest).subscribe(data => console.log(data));
    }
  }
}
