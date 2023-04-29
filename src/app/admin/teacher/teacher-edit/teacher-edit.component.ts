import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";
import {TeacherService} from "../../../services/teacher/teacher.service";
import {ITeacher, ITeacherAdd} from "../../../shared/models/ITeacher";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, take} from "rxjs";

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {
  teacherForm!: FormGroup;
  groupList: IGroup[] = [];
  imageUrl: string = '';
  selectedFile!: Uint8Array | null;
  id: number | null = null;
  teacher: ITeacherAdd = {
    firstName: "",
    lastName: "",
    description: "",
    dateOfBirth: new Date(),
    groupId: 0,
    picture: this.imageUrl
  };
  isLoading: boolean = false;
  errors: string = '';

  constructor(
    private _groupService: GroupService,
    private _formBuilder: FormBuilder,
    private _teacherService: TeacherService,
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.getGroupList();
    this.imageUrl = "./assets/images/default_picture.png";
    // this.selectedFile = this.convertDataURIToBinary(this.imageUrl);
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
    let pictureString = '';
    if (this.teacherForm.controls['profilePicture'].dirty) {
      for (let i = 0; i < this.selectedFile!.length; i++) {
        pictureString += String.fromCharCode(this.selectedFile![i]);
      }
    } else pictureString = this.teacher.picture

    this.teacher = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      description: formValues.description,
      dateOfBirth: formValues.dateOfBirth,
      groupId: formValues.group,
      picture: btoa(pictureString)
    };
    console.log(this.id)
    if (this.id) this._teacherService.update(this.id, this.teacher).subscribe(data => console.log(data + "plm"))
    else this._teacherService.add(this.teacher).subscribe(data => console.log(data));
  }

  onImageSelected($event: any) {
    const file = $event.target.files[0];
    this.readImage(file);
  }

  readImage(file: File): void {
    console.log(file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result as string;
      this.selectedFile = this.convertDataURIToBinary(reader.result);
      let pictureString = '';
      for (let i = 0; i < this.selectedFile!.length; i++) {
        pictureString += String.fromCharCode(this.selectedFile![i]);
      }
      this.teacher.picture = btoa(pictureString)
    };
  }

  convertDataURIToBinary(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  }
}
