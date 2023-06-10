import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

import jwt_decode from "jwt-decode";
import {finalize, take} from "rxjs";

import {ERequestStatus, IExtensionRequest} from "../../../shared/models/IRequest";
import {IGroup} from "../../../shared/models/IGroup";
import {IParentDto} from "../../../shared/models/IParent";
import {GroupService} from "../../../services/group/group.service";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {AccountService} from "../../../services/account/account.service";
import {FileUpload} from "../../../shared/models/FileUpload";
import {ExtensionRequestService} from "../../../services/extension-request/extension-request.service";

@Component({
  selector: 'app-parent-extension-request',
  templateUrl: './parent-extension-request.component.html',
  styleUrls: ['./parent-extension-request.component.scss']
})
export class ParentExtensionRequestComponent {
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  requestForm: any;
  request!: IExtensionRequest;
  groupList: IGroup[] = [];
  currentParent!: IParentDto;
  id!: number;
  isLoading: boolean = false;
  errors: string = '';
  minDate: any;
  maxDate: any;
  isLoadingUpdate: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _requestService: ExtensionRequestService,
    private _firebaseService: FirebaseService,
    private _accountService: AccountService
  ) {}

  ngOnInit() {
    this.getGroupList();
    this.currentParent = {
      firstName: "", lastName: "", phoneNumber: ""
    };
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      this.requestForm = this._formBuilder.group(
        {
          cnp: ["", Validators.required],
          firstName: ["", Validators.required],
          lastName: ["", Validators.required],
          dateOfBirth: ["", Validators.required],
          group: ["", Validators.required],
          profilePicture: [""],
          applicationPdf: [""],
        });
      this.id = +idParam;
      this.isLoading = true;
      this._requestService.getOneById(this.id)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
        next: data => {
          this.request = data;
          this.errors = '';
        },
        error: errors => this.errors = errors
      });
    } else {
      this.requestForm = this._formBuilder.group(
        {
          cnp: ["", Validators.required],
          firstName: ["", Validators.required],
          lastName: ["", Validators.required],
          dateOfBirth: ["", Validators.required],
          group: ["", Validators.required],
          profilePicture: [""],
          applicationPdf: ["", Validators.required],
        });
      this.request = {
        applicationForm: "",
        child: {
          cnp: "",
          dateOfBirth: new Date(),
          firstName: "",
          group: {
            id: 0,
            name: ""
          },
          lastName: "",
          parent: {
            firstName: "",
            lastName: "",
            phoneNumber: ""
          },
          picturePath: './assets/images/default_picture.png'
        }
        ,
        status: ERequestStatus.PENDING
      };
    }

    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 6, 0, 2).toISOString().split('T')[0];
    this.maxDate = new Date(currentDate.getFullYear() - 2, 0, 1).toISOString().split('T')[0];

  }

  getGroupList() {
    this._groupService.getAll().subscribe(
      response => {
        this.groupList = response;
      }
    )
  }


  handleSubmit() {
    // @ts-ignore
    let id = jwt_decode(this._accountService.getAuthenticatedToken())['id'];
    this.request.child.parentId = id;

    if (this.requestForm.touched && this.requestForm.valid) {
      this.isLoadingUpdate = true;
      this.errors = "";

      const updateObservable = this.id
        ? this._requestService.updateRequestByParent(this.request)
        : this._requestService.addRequest(this.request);
      console.log(updateObservable)
      updateObservable.pipe(
        take(1),
        finalize(() => this.isLoadingUpdate = false) // Set loading state to false regardless of success or error
      ).subscribe({
        next: (_) => {
          let updateMessage = this.id ? "Modificările s-au salvat cu succes" : "Cererea a fost înregistrată cu succes";
          this.submitEvent.emit({type: "success", message: updateMessage});
        },
        error: (_) => {
          this.submitEvent.emit({type: "error", message: "S-a produs o eroare, te rugăm încearcă mai târziu"});
        }
      });
    }

    if (!this.requestForm.valid) {
      this.errors = "Date invalide"
    }
  }

  onImageSelected($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'children').subscribe(
          (downloadURL: string) => {
            this.request.child.picturePath = downloadURL;
            console.log('File is accessible:', downloadURL);
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  onApplicationUpload($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'requests/registration').subscribe(
          (downloadURL: string) => {
            this.request.applicationForm = downloadURL;
            console.log('File is accessible:', downloadURL);
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

}
