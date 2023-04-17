import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AccountService} from "../../services/account/account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IAdminLoginData} from "../../shared/models/IAdminLoginData";
import {finalize, take} from "rxjs";

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {
  loginAdminForm!: FormGroup;
  isLoading: boolean = false;
  errors: string = '';
  hidePassword = true;

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _accountService: AccountService) {
  }

  ngOnInit(): void {
    this.loginAdminForm = this._formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  handleLogin() {
    const formValues = this.loginAdminForm.value;
    const loginData: IAdminLoginData = {
      username: formValues.username!,
      password: formValues.password!
    }
    if (!this.loginAdminForm.invalid) {
      this.isLoading = true;
      this._accountService.loginAdmin$(
        loginData.username!,
        loginData.password!
      )
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: _ => {
            console.log("aici")
            this._router.navigate(['admin']);
            this.errors = '';
          },
          error: data => {
            console.log(data)
            this.loginAdminForm.reset();
            this.errors = 'Credentiale incorecte';
          }
        }
      )
    }
  }
}
