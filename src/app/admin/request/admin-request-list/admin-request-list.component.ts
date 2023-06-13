import {Component, OnInit} from '@angular/core';

import {BehaviorSubject, forkJoin} from "rxjs";

import {IExtensionRequest, IRegistrationRequest, IRequest} from "../../../shared/models/IRequest";
import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";
import {ITeacher} from "../../../shared/models/ITeacher";

@Component({
  selector: 'app-admin-request-list',
  templateUrl: './admin-request-list.component.html',
  styleUrls: ['./admin-request-list.component.scss']
})
export class AdminRequestListComponent implements OnInit {
  registrationRequestList: BehaviorSubject<IRegistrationRequest[]> = new BehaviorSubject<IRegistrationRequest[]>([]);
  registrationRequestListInitial!: IRegistrationRequest[];
  paginatedRegistrationRequestList: IRegistrationRequest[] = [];
  extensionRequestList: BehaviorSubject<IExtensionRequest[]> = new BehaviorSubject<IExtensionRequest[]>([]);
  extensionRequestListInitial!: IExtensionRequest[];
  paginatedExtensionRequestList: IRegistrationRequest[] = [];
  groupList: IGroup[] = [];
  selectedGroupId: number = 0;
  requestType!: string;
  selectedType!: string;
  selectedStatus!: string;
  currentPage: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private _groupService: GroupService,
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService
  ) {}

  ngOnInit(): void {
    this.selectedGroupId = -1;
    this.selectedType = 'registration';
    this.selectedStatus = 'all';

    this._groupService.getAll().subscribe(data => this.groupList = data);
    this._registrationRequestService.getAll().subscribe(data => {
      this.registrationRequestList.next(data);
      this.registrationRequestListInitial = data;
      this.updatePagination();
    });
    this._extensionRequestService.getAll().subscribe(data => {
      // this.extensionRequestList.next(data);
      this.extensionRequestListInitial = data;
    });

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

    this.updatePagination();
  }

  getClassForBadge(status: string) {
    if (status == "APPROVED")
      return "text-bg-success";
    if (status == "REJECTED")
      return "text-bg-danger";
    if (status == "PENDING")
      return "text-bg-secondary";
    if (status == "ONGOING")
      return "text-bg-warning"
    return ""

  }

  updatePagination() {
    this.currentPage = 1;
    if (this.selectedType == "registration") {
      this.totalItems = this.registrationRequestList.getValue().length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginatedExtensionRequestList = [];
      this.paginatedRegistrationRequestList = this.applyPagination(this.registrationRequestList.getValue());
    }
    if (this.selectedType == "extension") {
      this.totalItems = this.extensionRequestList.getValue().length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginatedRegistrationRequestList = [];
      this.paginatedExtensionRequestList = this.applyPagination(this.extensionRequestList.getValue());
    }
  }

  applyPagination(list: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    return list.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.selectedType == "registration")
        this.paginatedRegistrationRequestList = this.applyPagination(this.registrationRequestList.getValue());
      else
        this.paginatedExtensionRequestList = this.applyPagination(this.extensionRequestList.getValue())
    }
  }

}
