import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {finalize, take} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {IChild} from "../../../shared/models/IChild";
import {ChildrenService} from "../../../services/children/children.service";
import {IGroup} from "../../../shared/models/IGroup";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  isLoadingDelete: boolean = false;
  deleteMessage: string = '';
  deleteError: string = '';
  isLoadingUpdate: boolean = false;
  updateMessage: string = '';
  updateError: string = '';
  id: string = '';
  child!: IChild;
  errors: string = '';
  groupList: IGroup[] = [];
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;
  minDate: any;
  maxDate: any;
  showSuccessAlert: any;
  showErrorAlert: any;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;

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
      cnp: ['', [Validators.required, Validators.pattern(/^[0-9]{13}$/), this.cnpValidator]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z -ăĂîÎâÂșȘțȚ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ăĂîÎâÂșȘțȚ]+$/)]],
      dateOfBirth: ['', Validators.required],
      group: ['', Validators.required],
      profilePicture: [''],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contactFirstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z -ăĂîÎâÂșȘțȚ]+$/)]],
      contactLastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ăĂîÎâÂșȘțȚ]+$/)]],
      contactEmail: ['', [Validators.required, Validators.email]],
    });

    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 6, 0, 2).toISOString().split('T')[0];
    this.maxDate = new Date(currentDate.getFullYear() - 2, 0, 1).toISOString().split('T')[0];

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
          phoneNumber: "",
          email: ""
        },
        picturePath: './assets/images/default_picture.png'
      };
    }
  }


  cnpValidator(control: FormControl): { [key: string]: any } | null{
    const value = control.value;
    console.log(value)
    // Check if the CNP is empty
    if (!value) {
      return null;
    }

    // Check CNP length
    if (value.length !== 13) {
      return { invalidCnpLength: true };
    }

    // Extract date components from CNP
    const year = 2000 + Number(value.substr(1, 2));
    const month = Number(value.substr(3, 2));
    const day = Number(value.substr(5, 2));

    // Validate date of birth
    const dateOfBirth = new Date(year, month - 1, day);
    const isValidDate = dateOfBirth.getFullYear() === year &&
      dateOfBirth.getMonth() === month - 1 &&
      dateOfBirth.getDate() === day;
    if (!isValidDate) {
      return { invalidDateOfBirth: true };
    }

    return null;
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
    this.updateError = "";
    this.updateMessage = "";
    this.errors = "";

    this.child = {
      parent: {
        firstName: formValues.contactFirstName,
        lastName: formValues.contactLastName,
        phoneNumber: formValues.contactPhoneNumber,
        email: formValues.contactEmail,
        id: this.child.parent?.id
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
    // if (this.childForm.touched && this.childForm.valid) {
    //   if (this.id) this._childrenService.update(this.id, this.child).pipe(
    //     take(1),
    //     finalize(() => this.isLoadingUpdate = false)
    //   ).subscribe({
    //     next: _ => {
    //       this.updateMessage = "Modificările s-au salvat cu succes";
    //       this.showSuccessAlert = true;
    //       this.scrollToSuccessAlert();
    //     },
    //     error: _ => {
    //       this.showErrorAlert = true;
    //       this.scrollToErrorAlert();
    //     }
    //   })
    //   else this._childrenService.add(this.child).pipe(
    //     take(1),
    //     finalize(() => this.isLoadingUpdate = false)
    //   ).subscribe({
    //     next: _ => {
    //       this.updateMessage = "Copilul a fost adăgat în sistem";
    //       this.showSuccessAlert = true;
    //       this.scrollToSuccessAlert();
    //     },
    //     error: _ => {
    //       this.showErrorAlert = true;
    //       this.scrollToErrorAlert();
    //     }
    //   })
    // }
    if (this.childForm.touched && this.childForm.valid) {
      this.isLoadingUpdate = true; // Set loading state to true

      const updateObservable = this.id
        ? this._childrenService.update(this.id, this.child)
        : this._childrenService.add(this.child);

      updateObservable.pipe(
        take(1),
        finalize(() => this.isLoadingUpdate = false) // Set loading state to false regardless of success or error
      ).subscribe({
        next: (_) => {
          this.updateMessage = this.id ? "Modificările s-au salvat cu succes" : "Copilul a fost adăgat în sistem";
          this.showSuccessAlert = true;
          setTimeout(() => this.scrollToSuccessAlert(), 0);
        },
        error: (_) => {
          this.showErrorAlert = true;
          setTimeout(() => this.scrollToErrorAlert(), 0);
        }
      });
    }

    if (!this.childForm.valid) {
      this.errors = "Date invalide"
    }

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
    this.isLoadingDelete = true;
    this.deleteMessage = '';
    this.deleteError = '';
    // this._childrenService.deleteChild(this.child).subscribe(data => {
    //   console.log(data);
    //   this.modalRef?.close();
    //   setTimeout(() => this._router.navigate(['/admin/children']), 1000);
    // });
    this._childrenService.deleteChild(this.child).pipe(
      take(1),
      finalize(() => this.isLoadingDelete = false)
    ).subscribe({
      next: data => {
        this.deleteMessage = "Copilul a fost șters cu succes";
      },
      error: _ => {
        this.deleteError = 'S-a produs o eroare';
      }
    });
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
    console.log(this.successAlertRef)
    if (this.successAlertRef && this.successAlertRef.nativeElement) {
      this.successAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.successAlertRef.nativeElement.focus();
    }
  }

  scrollToErrorAlert() {
    if (this.errorAlertRef && this.errorAlertRef.nativeElement) {
      this.errorAlertRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      // or use this.successAlertRef.nativeElement.focus();
    }
  }
}
