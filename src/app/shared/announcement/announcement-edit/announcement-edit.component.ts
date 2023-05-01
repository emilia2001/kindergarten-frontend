import {Component, OnInit} from '@angular/core';
import {IAnnouncement} from "../../models/IAnnouncement";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnnouncementService} from "../../../services/announcement/announcement.service";

@Component({
  selector: 'app-announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent implements OnInit {
  announcementForm!: FormGroup;
  isLoading!: boolean;
  id!: string;
  imageUrl: string = '';
  selectedFile!: Uint8Array | null;
  announcement!: IAnnouncement;
  errors!: string;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _announcementService: AnnouncementService,
  ) { }

  ngOnInit() {
    this.imageUrl = "./assets/images/default_picture_article.png";
    const entity = this._route.snapshot.queryParamMap.get('entity');
    if (entity) {
      this.announcement = JSON.parse(decodeURIComponent(entity));
    } else {
      this.announcement = {
        description: "", picture: "", title: ""
      }
    }
    this.announcementForm = this._formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      picture: ["", Validators.required]
    });
    console.log(this.imageUrl)
  }

  handleSubmitAnnouncement() {
    const formValues = this.announcementForm.value;
    let pictureString = '';
    if (this.announcementForm.controls['picture'].dirty) {
      for (let i = 0; i < this.selectedFile!.length; i++) {
        pictureString += String.fromCharCode(this.selectedFile![i]);
      }
    } else pictureString = this.announcement.picture

    this.announcement = {
      id: this.announcement.id,
      title: formValues.title,
      description: formValues.description,
      picture: btoa(pictureString)
    };
    console.log(this.announcement)
    if (this._route.snapshot.queryParamMap.get('entity')) this._announcementService.update(this.announcement).subscribe(data => console.log(data))
    else this._announcementService.add(this.announcement).subscribe(data => console.log(data));

  }

  onImageSelected($event: any) {
    const file = $event.target!.files[0];
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
      this.announcement.picture = btoa(pictureString)
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
