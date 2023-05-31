import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {finalize, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {IChild} from "../../../shared/models/IChild";
import {ChildrenService} from "../../../services/children/children.service";
import {IGroup} from "../../../shared/models/IGroup";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../../services/group/group.service";
import {FileUpload} from "../../../shared/models/FileUpload";
import {FirebaseService} from "../../../services/firebase/firebase.service";

@Component({
  selector: 'app-children-edit',
  templateUrl: './children-edit.component.html',
  styleUrls: ['./children-edit.component.scss']
})
export class ChildrenEditComponent {
  childForm!: FormGroup;
  isLoading: boolean = false;
  id: string = '';
  child!: IChild;
  errors: string = '';
  groupList: IGroup[] = [];
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _childrenService: ChildrenService,
    public modalService: NgbModal,
    private _firebaseService: FirebaseService
  ) {
  }

  ngOnInit() {
    this.getGroupList();
    this.childForm = this._formBuilder.group({
      cnp: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      group: ["", Validators.required],
      profilePicture: ["", Validators.required],
      contactPhoneNumber: ["", Validators.required],
      contactFirstName: ["", Validators.required],
      contactLastName: ["", Validators.required],
    });

    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = idParam;
      this.isLoading = true;
      this._childrenService.getOneById(this.id)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
        next: data => {
          this.child = data;
          this.errors = '';
        },
        error: errors => this.errors = errors
      });
    } else {
      this.child  = {
        cnp: "",
        dateOfBirth: new Date(),
        firstName: "", group: {
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

  handleSubmitChild() {
    const formValues = this.childForm.value;
    let newPicture = this.child.picturePath;

    this.child = {
      parent: {
        firstName: formValues.contactFirstName,
        lastName: formValues.contactLastName,
        phoneNumber: formValues.contactPhoneNumber
      },
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      cnp: formValues.cnp,
      dateOfBirth: formValues.dateOfBirth,
      group: {
        id: formValues.group,
        name: formValues.group.selected
      },
      picturePath: newPicture
    };

    if (this.id) this._childrenService.update(this.id, this.child).subscribe(data => console.log(data + "plm"))
    else this._childrenService.add(this.child).subscribe(data => console.log(data));
  }

  onImageSelected($event: any) {
    this.selectedFiles = $event.target.files;
    this.upload();
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);

        this._firebaseService.pushFileToStorage(this.currentFileUpload, 'children').subscribe(
          (downloadURL: string) => {
            this.child.picturePath = downloadURL;
            console.log('File is accessible:', downloadURL);
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  openModal(myModal: TemplateRef<any>) {
    if (this.myModal) {
      this.modalRef = this.modalService.open(this.myModal);

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

  deleteChild() {
    this._childrenService.deleteChild(this.child.cnp).subscribe(data => {
      console.log(data);
      this.modalRef?.close();
      setTimeout(() => this._router.navigate(['/admin/children']), 1000);
    });
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close()
    }
  }
}
