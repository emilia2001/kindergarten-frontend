import { Component } from '@angular/core';
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
            console.log(data)

            this.errors = '';
          },
          error: err => {
            this.loginAdminForm.reset();
            this.errors = err.errors.status;
          }
        }
      )
    }
  }
}
