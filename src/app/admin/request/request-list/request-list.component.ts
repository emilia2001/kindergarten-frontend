import {Component, OnInit} from '@angular/core';

import {BehaviorSubject} from "rxjs";

import {IExtensionRequest, IRegistrationRequest} from "../../../shared/models/IRequest";
import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  registrationRequestList: BehaviorSubject<IRegistrationRequest[]> = new BehaviorSubject<IRegistrationRequest[]>([]);
  registrationRequestListInitial!: IRegistrationRequest[];
  extensionRequestList: BehaviorSubject<IExtensionRequest[]> = new BehaviorSubject<IExtensionRequest[]>([]);
  extensionRequestListInitial!: IExtensionRequest[];
  groupList: IGroup[] = [];
  selectedGroupId: number = 0;
  requestType!: string;

  constructor(
    private _groupService: GroupService,
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService
  ) {
  }

  ngOnInit(): void {
    this._groupService.getAll().subscribe(data => this.groupList = data);
    this._registrationRequestService.getAll().subscribe(data => {
      this.registrationRequestList.next(data);
      this.registrationRequestListInitial = data;
    });
    this._extensionRequestService.getAll().subscribe(data => {
      this.extensionRequestList.next(data);
      this.extensionRequestListInitial = data;
    });
  }

  handleGroupChange($event: any) {
    if($event.target.value == "-1") {
      this.registrationRequestList.next(this.registrationRequestListInitial);
      this.extensionRequestList.next(this.extensionRequestListInitial);
    } else {
      this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.child.group.id == $event.target.value));
      this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.child.group.id == $event.target.value));
    }
  }

  handleTypeChange($event: any) {
    if($event.target.value == 'extension'){
      this.registrationRequestList.next([]);
      this.extensionRequestList.next(this.extensionRequestListInitial);
    }
    if($event.target.value == 'registration'){
      this.registrationRequestList.next(this.registrationRequestListInitial);
      this.extensionRequestList.next([]);
    }
    if($event.target.value == 'all') {
      this.registrationRequestList.next(this.registrationRequestListInitial);
      this.extensionRequestList.next(this.extensionRequestListInitial);
    }
  }
}
