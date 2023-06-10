import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {finalize, take} from "rxjs";

import {Role} from "../../shared/models/IAdminLoginData";
import {AdminService} from "../../services/admin/admin.service";

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent {
  loginAdminForm!: FormGroup;
  isLoading: boolean = false;
  errors: string = '';
  hidePassword = true;
  role!: Role;
  showSuccessAlert: any;
  showErrorAlert: any;
  @ViewChild('successAlert') successAlertRef!: ElementRef;
  @ViewChild('errorAlert') errorAlertRef!: ElementRef;

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _adminService: AdminService) {}

  ngOnInit(): void {
    this.loginAdminForm = this._formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.role = window.location.pathname.includes('admin') ? Role.ADMIN : Role.PARENT;
  }

  handleSubmit() {
    const formValues = this.loginAdminForm.value;
    if (!this.loginAdminForm.invalid) {
      this.isLoading = true;
      this._adminService.add( {
        username: formValues.username!,
        password: formValues.password!
      }
      )
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: data => {
            this.showSuccessAlert = true;
            setTimeout(() => this.scrollToSuccessAlert(), 0);
          },
          error: err => {
            this.loginAdminForm.reset();
            this.showErrorAlert = true;
            setTimeout(() => this.scrollToErrorAlert(), 0);
          }
        }
      )
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
      // or use this.successAlertRef.nativeElement.focus();
    }
  }
}
