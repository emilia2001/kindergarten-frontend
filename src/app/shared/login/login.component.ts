import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {finalize, take} from "rxjs";
import jwt_decode from "jwt-decode";

import {Role} from "../models/IAdminLoginData";
import {AccountService} from "../../services/account/account.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginAdminForm!: FormGroup;
  isLoading: boolean = false;
  errors: string = '';
  hidePassword = true;
  role!: Role;

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loginAdminForm = this._formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.role = window.location.pathname.includes('admin') ? Role.ADMIN : Role.PARENT;
  }

  handleLogin() {
    const formValues = this.loginAdminForm.value;
    if (!this.loginAdminForm.invalid) {
      this.isLoading = true;
      this._accountService.login$(
        formValues.username!,
        formValues.password!,
        this.role,
      )
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: data => {
            // @ts-ignore
            var role = jwt_decode(data['token'])['role'];
            if (role == Role.ADMIN) this._router.navigate(['admin']);
            else this._router.navigate([''])

            this.errors = '';
          },
          error: _ => {
            this.loginAdminForm.reset();
            this.errors = 'Credentiale incorecte';
          }
        }
      )
    }
  }
}
