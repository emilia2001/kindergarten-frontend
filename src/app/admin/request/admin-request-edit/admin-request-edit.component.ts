import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";

import {finalize, Observable, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {GroupService} from "../../../services/group/group.service";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {AccountService} from "../../../services/account/account.service";
import {ERequestStatus, IExtensionRequest, IRegistrationRequest} from "../../../shared/models/IRequest";
import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {IGroupSpotsDto} from "../../../shared/models/IGroup";

@Component({
  selector: 'app-admin-request-edit',
  templateUrl: './admin-request-edit.component.html',
  styleUrls: ['./admin-request-edit.component.scss']
})
export class AdminRequestEditComponent implements OnInit {
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  isLoading!: boolean;
  requestType!: string;
  registrationRequest!: IRegistrationRequest;
  extensionRequest!: IExtensionRequest;
  comments!: string;
  idParam!: number;
  groupSpots!: IGroupSpotsDto;
  isClosed: any;
  updateMessage: string = '';
  isLoadingUpdate: boolean = false;
  showSuccessAlert: any;
  showErrorAlert: any;
  modalRef: NgbModalRef | undefined;
  isLoadingStatus: boolean = false;
  statusMessage: string = '';
  statusError: boolean = false;
  status: string = '';
  confirmationMessage: string = '';
  statusTitle: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _registrationRequestService: RegistrationRequestService,
    private _extensionRequestService: ExtensionRequestService,
    private _firebaseService: FirebaseService,
    public _modalService: NgbModal,
    private _accountService: AccountService,
  ) {}

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
    this.isLoadingUpdate = true;
    let updateObservable: Observable<any>;
    if (this.requestType == 'registration'){
      this.registrationRequest.status = ERequestStatus.ONGOING;
      updateObservable = this._registrationRequestService.updateRequestByAdmin(this.registrationRequest);
    }
    if (this.requestType == 'extension') {
      this.extensionRequest.status = ERequestStatus.ONGOING;
      updateObservable = this._extensionRequestService.updateRequestByAdmin(this.extensionRequest);
    }

    updateObservable!.pipe(
      take(1),
      finalize(() => this.isLoadingUpdate = false) // Set loading state to false regardless of success or error
    ).subscribe({
      next: (_) => {
        this.updateMessage = "Mesajul a fost adăugat cu succes";
        this.showSuccessAlert = true;
        setTimeout(() => this.scrollToSuccessAlert(), 0);
      },
      error: (_) => {
        this.showErrorAlert = true;
        setTimeout(() => this.scrollToErrorAlert(), 0);
      }
    });
  }

  openModal() {
    this.statusMessage = "";
    this.statusError = false;
    if (this.myModal) {
      this.modalRef = this._modalService.open(this.myModal);

      this.modalRef.result.then(
        () => {
          console.log('Modal closed');
        },
        () => {
          console.log('Modal dismissed');
        }
      );
    }
  }

  approveRequest() {
    this.status = "approve";
    this.statusTitle = "aprobare";
    this.confirmationMessage = "Ești sigur că dorești să marchezi cererea ca aprobată?"
    this.openModal();
  }

  rejectRequest() {
    this.status = "reject";
    this.statusTitle = "respingere";
    this.confirmationMessage = "Ești sigur că dorești să marchezi cererea ca respinsă?"
    this.openModal();
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close();
    }
  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }

  closeErrorAlert() {
    this.showErrorAlert = false;
  }

  scrollToSuccessAlert() {
    if (this.successAlertRef && this.successAlertRef.nativeElement) {
      this.successAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.successAlertRef.nativeElement.focus();
    }
  }

  scrollToErrorAlert() {
    if (this.errorAlertRef && this.errorAlertRef.nativeElement) {
      this.errorAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateStatus() {
    let updateObservable: Observable<any>;
    if (this.status == "approve") {
      if (this.requestType == 'registration') {
        this.registrationRequest.status = ERequestStatus.APPROVED;
        updateObservable = this._registrationRequestService.updateRequestByAdmin(this.registrationRequest);
      }
      if (this.requestType == 'extension') {
        this.extensionRequest.status = ERequestStatus.APPROVED;
        updateObservable = this._extensionRequestService.updateRequestByAdmin(this.extensionRequest);
      }
    }
    if (this.status == "reject") {
      if (this.requestType == 'registration') {
        this.registrationRequest.status = ERequestStatus.REJECTED;
        updateObservable = this._registrationRequestService.updateRequestByAdmin(this.registrationRequest);
      }
      if (this.requestType == 'extension') {
        this.extensionRequest.status = ERequestStatus.REJECTED;
        updateObservable = this._extensionRequestService.updateRequestByAdmin(this.extensionRequest);
      }
    }
    this.isLoadingStatus = true;
    updateObservable!.pipe(
      take(1),
      finalize(() => this.isLoadingStatus = false) // Set loading state to false regardless of success or error
    ).subscribe({
      next: (_) => {
        this.statusMessage = this.status == 'approve' ? "Cererea a fost aprobată cu succes" : "Cererea a fost respinsă";
        this.isClosed = true;
      },
      error: (_) => {
        this.statusError = true;
      }
    });
  }
}
