import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {LoginAdminComponent} from "./login-admin/login-admin.component";
import {AdminComponent} from "./admin.component";
import {WelcomeAdminComponent} from "./welcome-admin/welcome-admin.component";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
  declarations: [
    AdminComponent,
    LoginAdminComponent,
    WelcomeAdminComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ]
})
export class AdminModule { }
