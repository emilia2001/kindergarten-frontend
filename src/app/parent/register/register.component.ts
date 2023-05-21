import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {AccountService} from "../../services/account/account.service";
import {IParentDto} from "../../shared/models/IParent";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  errors!: boolean;
  isLoading!: Boolean;
  registerForm: any;
  hidePassword!: any;
  hidePasswordRepeat = true;

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      username: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.hidePassword = true;
  }

  handleRegister() {
    const formValues = this.registerForm.value;
    const parent: IParentDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phoneNumber: formValues.phoneNumber,
      email: formValues.email,
      username: formValues.username!,
      password: formValues.password!
    }
    if (!this.registerForm.invalid) {
      this.isLoading = true;
      this._accountService.register(parent);
      this.isLoading = false;
      //   .pipe(
      //     take(1),
      //     finalize(() => this.isLoading = false)
      //   ).subscribe({
      //     next: data => {
      //       // @ts-ignore
      //       var role = jwt_decode(data['token'])['role'];
      //       if (role == Role.ADMIN) this._router.navigate(['admin']);
      //       else this._router.navigate([''])
      //
      //       this.errors = '';
      //     },
      //     error: _ => {
      //       this.loginAdminForm.reset();
      //       this.errors = 'Credentiale incorecte';
      //     }
      //   }
      // )
    }
  }

}
