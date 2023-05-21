import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

import {finalize, take} from "rxjs";
import jwt_decode from "jwt-decode";

import {ERequestStatus, IRegistrationRequest} from "../../../shared/models/IRequest";
import {GroupService} from "../../../services/group/group.service";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {IGroup} from "../../../shared/models/IGroup";
import {IParentDto} from "../../../shared/models/IParent";
import {RegistrationRequestService} from "../../../services/registration-request/registration-request.service";
import {FileUpload} from "../../../shared/models/FileUpload";
import {AccountService} from "../../../services/account/account.service";

@Component({
  selector: 'app-registration-request',
  templateUrl: './registration-request.component.html',
  styleUrls: ['./registration-request.component.scss']
})
export class RegistrationRequestComponent implements OnInit {
  requestForm: any;
  request!: IRegistrationRequest;
  groupList: IGroup[] = [];
  currentParent!: IParentDto;
  id!: number;
  isLoading: boolean = false;
  errors: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _requestService: RegistrationRequestService,
    private _firebaseService: FirebaseService,
    private _accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.getGroupList();
    this.currentParent = {
      firstName: "", lastName: "", phoneNumber: ""
    };
    this.requestForm = this._formBuilder.group(
      {
      cnp: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      group: ["", Validators.required],
      profilePicture: ["", Validators.required],
      applicationPdf: ["", Validators.required],
      parentIC: ["", Validators.required],
      childBirthCertificate: ["", Validators.required],
      parentsEmployeeCertificates: ["", Validators.required],
      extraDocuments: [""],
    });
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
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
        childBirthCertificate: "",
        extraDocuments: "",
        parentIdentityCard: "",
        parentsEmployeeCertificates: "",
        status: ERequestStatus.PENDING
      };
    }
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
    this._requestService.addRequest(this.request).subscribe(data => console.log(data));
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
            // Perform further operations with the file
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
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  onParentICUpload($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'requests/registration').subscribe(
          (downloadURL: string) => {
            this.request.parentIdentityCard = downloadURL;
            console.log('File is accessible:', downloadURL);
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  onChildBirthCertificateUpload($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'requests/registration').subscribe(
          (downloadURL: string) => {
            this.request.childBirthCertificate = downloadURL;
            console.log('File is accessible:', downloadURL);
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  onParentsEmployeeCertificatesUpload($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'requests/registration').subscribe(
          (downloadURL: string) => {
            this.request.parentsEmployeeCertificates = downloadURL;
            console.log('File is accessible:', downloadURL);
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  onExtraDocumentsUpload($event: any) {
    let selectedFiles = $event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        const currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(currentFileUpload, 'requests/registration').subscribe(
          (downloadURL: string) => {
            this.request.extraDocuments = downloadURL;
            console.log('File is accessible:', downloadURL);
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }
}
