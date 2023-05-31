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
  selectedType!: string;
  selectedStatus!: string;

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
    this.selectedGroupId = -1;
    this.selectedType = 'all';
    this.selectedStatus = 'all';
  }

  handleGroupChange($event: any) {
    this.selectedGroupId = $event.target.value;
    this.handleFilter()
  }

  handleTypeChange($event: any) {
    this.selectedType = $event.target.value;
    this.handleFilter()
  }

  handleStatusChange($event: any) {
    this.selectedStatus = $event.target.value;
    this.handleFilter()
  }

  handleFilter() {
    if (this.selectedGroupId == -1) {
      if (this.selectedType == 'all') {
        if (this.selectedStatus == 'all') {
          this.registrationRequestList.next(this.registrationRequestListInitial);
          this.extensionRequestList.next(this.extensionRequestListInitial);
        }
        else {
          this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.status == this.selectedStatus));
          this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.status == this.selectedStatus));
        }
      } else {
        if (this.selectedStatus == 'all') {
          if(this.selectedType == 'extension'){
            this.registrationRequestList.next([]);
            this.extensionRequestList.next(this.extensionRequestListInitial);
          }
          if(this.selectedType == 'registration'){
            this.registrationRequestList.next(this.registrationRequestListInitial);
            this.extensionRequestList.next([]);
          }
        }
        else {
          if(this.selectedType == 'extension'){
            this.registrationRequestList.next([]);
            this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.status == this.selectedStatus));
          }
          if(this.selectedType == 'registration'){
            this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.status == this.selectedStatus));
            this.extensionRequestList.next([]);
          }
        }
      }
    } else {
      if (this.selectedType == 'all') {
        if (this.selectedStatus == 'all') {
          this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.child.group.id == this.selectedGroupId));
          this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.child.group.id == this.selectedGroupId));
        }
        else {
          this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.status == this.selectedStatus && request.child.group.id == this.selectedGroupId));
          this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.status == this.selectedStatus && request.child.group.id == this.selectedGroupId));
        }
      } else {
        if (this.selectedStatus == 'all') {
          if(this.selectedType == 'extension'){
            this.registrationRequestList.next([]);
            this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.child.group.id == this.selectedGroupId));
          }
          if(this.selectedType == 'registration'){
            this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.child.group.id == this.selectedGroupId));
            this.extensionRequestList.next([]);
          }
        }
        else {
          if(this.selectedType == 'extension'){
            this.registrationRequestList.next([]);
            this.extensionRequestList.next(this.extensionRequestListInitial.filter(request => request.status == this.selectedStatus && request.child.group.id == this.selectedGroupId));
          }
          if(this.selectedType == 'registration'){
            this.registrationRequestList.next(this.registrationRequestListInitial.filter(request => request.status == this.selectedStatus && request.child.group.id == this.selectedGroupId));
            this.extensionRequestList.next([]);
          }
        }
      }
    }
  }
}
