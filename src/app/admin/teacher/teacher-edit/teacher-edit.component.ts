import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {finalize, take} from "rxjs";

import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";
import {TeacherService} from "../../../services/teacher/teacher.service";
import {ITeacherAdd} from "../../../shared/models/ITeacher";
import {FileUpload} from "../../../shared/models/FileUpload";
import {FirebaseService} from "../../../services/firebase/firebase.service";

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  teacherForm!: FormGroup;
  groupList: IGroup[] = [];
  id: number | null = null;
  teacher!: ITeacherAdd;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  isLoading: boolean = false;
  errors: string = '';
  modalRef: NgbModalRef | undefined;
  isLoadingDelete: boolean = false;
  deleteMessage: string = '';
  deleteError: string = '';
  isLoadingUpdate: boolean = false;
  updateMessage: string = '';
  updateError: string = '';
  minDate: any;
  maxDate: any;
  showSuccessAlert: any;
  showErrorAlert: any;
  pictureUpload: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _teacherService: TeacherService,
    private _firebaseService: FirebaseService,
     public modalService: NgbModal,
    private _router: Router,
  ) {}

  ngOnInit() {
    this.getGroupList();
    this.teacherForm = this._formBuilder.group({
      firstName: ["", [Validators.required, Validators.pattern("^[a-zA-Z -ăĂîÎâÂșȘțȚ]+$")]],
      lastName: ["", [Validators.required, Validators.pattern("^[a-zA-Z -ăĂîÎâÂșȘțȚ]+$")]],
      description: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      group: ["", Validators.required],
      profilePicture: [""]
    });
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.isLoading = true;
      this._teacherService.getOneById(this.id)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
        next: data => {
          this.teacher = data;
          this.errors = '';
        },
        error: errors => this.errors = errors
      });
    } else {
      this.teacher = {
        firstName: "",
        lastName: "",
        description: "",
        dateOfBirth: new Date(),
        groupId: 0,
        picturePath: './assets/images/default_picture.png'
      };
    }

    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 50, 0, 2).toISOString().split('T')[0];
    this.maxDate = new Date(currentDate.getFullYear() - 19, 0, 1).toISOString().split('T')[0];

  }

  getGroupList() {
    this._groupService.getAll().subscribe(
      response => {
        this.groupList = response;
      }
    )
  }

  handleSubmitTeacher() {
    const formValues = this.teacherForm.value;
    let newPicture = this.teacher.picturePath;
    this.updateError = "";
    this.updateMessage = "";
    this.errors = "";

    this.teacher = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      description: formValues.description,
      dateOfBirth: formValues.dateOfBirth,
      groupId: formValues.group,
      picturePath: newPicture,
      id: this.teacher.id
    };
    if ((this.teacherForm.touched && this.teacherForm.valid) || this.pictureUpload) {
      this.isLoadingUpdate = true; // Set loading state to true

      const updateObservable = this.id
        ? this._teacherService.update(this.id, this.teacher)
        : this._teacherService.add(this.teacher);

      updateObservable.pipe(
        take(1),
        finalize(() => this.isLoadingUpdate = false) // Set loading state to false regardless of success or error
      ).subscribe({
        next: (_) => {
          this.updateMessage = this.id ? "Modificările s-au salvat cu succes" : "Educatoarea a fost adăugată în sistem";
          this.showSuccessAlert = true;
          setTimeout(() => this.scrollToSuccessAlert(), 0);
        },
        error: (_) => {
          this.showErrorAlert = true;
          setTimeout(() => this.scrollToErrorAlert(), 0);
        }
      });
    }

    if (!this.teacherForm.valid) {
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

        this._firebaseService.pushFileToStorage(this.currentFileUpload, 'teachers').subscribe(
          (downloadURL: string) => {
            this.pictureUpload = true;
            this.teacher.picturePath = downloadURL;
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
    }
  }

  openModal(myModal: TemplateRef<any>) {
    this.deleteError = "";
    this.deleteMessage = "";
    if (this.myModal) {
      this.modalRef = this.modalService.open(this.myModal);

      this.modalRef.result.then(
        () => {
          console.log('Modal closed');
          if (this.deleteMessage)
            this._router.navigate(["/admin/teachers"]);
        },
        () => {
          console.log('Modal dismissed');
          if( this.deleteMessage)
            this._router.navigate(["/admin/teachers"]);
        }
      );
    }
  }

  deleteTeacher() {
    this._teacherService.deleteTeacher(this.teacher.id!).pipe(
      take(1),
      finalize(() => this.isLoadingDelete = false)
    ).subscribe({
      next: _ => {
        this.deleteMessage = "Educatoarea a fost ștearsă din sistem cu succes";
      },
      error: _ => {
        this.deleteError = 'S-a produs o eroare';
      }
    });
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close()
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
}
