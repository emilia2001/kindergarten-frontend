import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {finalize, take} from "rxjs";

import {IAnnouncement} from "../../models/IAnnouncement";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnnouncementService} from "../../../services/announcement/announcement.service";
import {FileUpload} from "../../models/FileUpload";
import {FirebaseService} from "../../../services/firebase/firebase.service";

@Component({
  selector: 'app-announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent implements OnInit {
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;
  announcementForm!: FormGroup;
  isLoading!: boolean;
  id!: number;
  announcement!: IAnnouncement;
  errors!: string;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  isLoadingUpdate: boolean = false;
  updateMessage: string = '';
  showSuccessAlert: any;
  showErrorAlert: any;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _announcementService: AnnouncementService,
    private _firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.announcementForm = this._formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      picture: [""]
    });
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.isLoading = true;
      this._announcementService.getOneById(this.id)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: data => {
            this.announcement = data;
            this.errors = ''
          },
          error: errors => this.errors = errors
        }
      )
    } else {
      this.announcement = {
        description: "",
        title: "",
        picturePath: './assets/images/default_picture_article.png'
      };
    }
  }

  handleSubmitAnnouncement() {
    const formValues = this.announcementForm.value;
    let newPicture = this.announcement.picturePath;

    this.announcement = {
      picturePath: newPicture,
      id: this.announcement.id,
      title: formValues.title,
      description: formValues.description
    };
    if (this.announcementForm.touched && this.announcementForm.valid) {
      this.isLoadingUpdate = true;

      const updateObservable = this.id
        ? this._announcementService.update(this.announcement)
        : this._announcementService.add(this.announcement);

      updateObservable.pipe(
        take(1),
        finalize(() => this.isLoadingUpdate = false)
      ).subscribe({
        next: (_) => {
          this.updateMessage = this.id ? "Modificările s-au salvat cu succes" : "Anunțul a fost salvat în sistem";
          this.showSuccessAlert = true;
          setTimeout(() => this.scrollToSuccessAlert(), 0);
        },
        error: (_) => {
          this.showErrorAlert = true;
          setTimeout(() => this.scrollToErrorAlert(), 0);
        }
      });
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

        this._firebaseService.pushFileToStorage(this.currentFileUpload, 'announcements').subscribe(
          (downloadURL: string) => {
            this.announcement.picturePath = downloadURL;
            // Perform further operations with the file
          },
          (error) => {
            console.error('Error occurred during file upload:', error);
          }
        );
      }
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
