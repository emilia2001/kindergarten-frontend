import {Component} from '@angular/core';
import {IChild} from "../../../shared/models/IChild";
import {ChildrenService} from "../../../services/children/children.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IGroup} from "../../../shared/models/IGroup";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../../services/group/group.service";
import {finalize, take} from "rxjs";

@Component({
  selector: 'app-children-edit',
  templateUrl: './children-edit.component.html',
  styleUrls: ['./children-edit.component.scss']
})
export class ChildrenEditComponent {
  id: string = '';
  isLoading: boolean = false;
  errors: string = '';
  childForm!: FormGroup;
  imageUrl: string = '';
  selectedFile!: Uint8Array | null;
  groupList: IGroup[] = [];
  child: IChild = {
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
    picture: this.imageUrl

  }

  constructor(
    private _groupService: GroupService,
    private _childrenService: ChildrenService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.getGroupList();
    this.id = this._route.snapshot.params['id'];
    this.imageUrl = "./assets/images/default_picture.png";
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
    let pictureString = '';
    if (this.childForm.controls['profilePicture'].dirty) {
      for (let i = 0; i < this.selectedFile!.length; i++) {
        pictureString += String.fromCharCode(this.selectedFile![i]);
      }
    } else pictureString = this.child.picture

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
      picture: btoa(pictureString)
    };
    console.log(this.child)
    if (this.id) this._childrenService.update(this.id, this.child).subscribe(data => console.log(data + "plm"))
    else this._childrenService.add(this.child).subscribe(data => console.log(data));
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
      this.child.picture = btoa(pictureString)
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
