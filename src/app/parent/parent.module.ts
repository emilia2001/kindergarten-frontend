import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ParentComponent} from "./parent.component";
import {ParentRequestsListComponent} from "./request/parent-requests-list/parent-requests-list.component";
import {NewRequestComponent} from "./request/new-request/new-request.component";
import {ParentPaymentListComponent} from "./parent-payment-list/parent-payment-list.component";
import {ParentRegistrationRequestComponent} from "./request/parent-registration-request/parent-registration-request.component";
import {ParentExtensionRequestComponent} from "./request/parent-extension-request/parent-extension-request.component";
import {ParentRequestEditComponent} from "./request/parent-request-edit/parent-request-edit.component";
import {RegisterComponent} from "./register/register.component";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {AdminModule} from "../admin/admin.module";



@NgModule({
  declarations: [
    ParentComponent,
    ParentRequestsListComponent,
    NewRequestComponent,
    ParentPaymentListComponent,
    ParentRegistrationRequestComponent,
    ParentExtensionRequestComponent,
    ParentRequestEditComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule,
    AdminModule
  ]
})
export class ParentModule { }
