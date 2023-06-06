import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";
import {TeacherService} from "../../../services/teacher/teacher.service";
import {ITeacherAdd} from "../../../shared/models/ITeacher";
import {finalize, take} from "rxjs";
import {FileUpload} from "../../../shared/models/FileUpload";
import {FirebaseService} from "../../../services/firebase/firebase.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {
  teacherForm!: FormGroup;
  groupList: IGroup[] = [];
  id: number | null = null;
  teacher!: ITeacherAdd;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  isLoading: boolean = false;
  errors: string = '';
  @ViewChild('myModal') myModal: TemplateRef<any> | undefined;
  modalRef: NgbModalRef | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _teacherService: TeacherService,
    private _firebaseService: FirebaseService,
     public modalService: NgbModal,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this.getGroupList();
    this.teacherForm = this._formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      description: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      group: ["", Validators.required],
      profilePicture: ["", Validators.required]
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

    this.teacher = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      description: formValues.description,
      dateOfBirth: formValues.dateOfBirth,
      groupId: formValues.group,
      picturePath: newPicture
    };

    if (this.id) this._teacherService.update(this.id, this.teacher).subscribe(data => console.log(data))
    else this._teacherService.add(this.teacher).subscribe(data => console.log(data));
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
            this.teacher.picturePath = downloadURL;
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

  deleteTeacher() {
    this._teacherService.deleteTeacher(this.teacher.id!).subscribe(data => {
      console.log(data);
      this.modalRef?.close();
      setTimeout(() => this._router.navigate(['/admin/teacher']), 1000);
    });
  }

  closeModal() {
    if (this.myModal) {
      this.modalRef?.close()
    }
  }
}
