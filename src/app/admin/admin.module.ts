import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

import {AppRoutingModule} from "../app-routing.module";
import {AdminComponent} from "./admin.component";
import {TeacherListComponent} from './teacher/teacher-list/teacher-list.component';
import {TeacherEditComponent} from './teacher/teacher-edit/teacher-edit.component';
import {ClassBookComponent} from './classbook/class-book.component';
import {RequestListComponent} from './request/request-list/request-list.component';
import {RequestEditComponent} from './request/request-edit/request-edit.component';
import {PaymentListComponent} from './payment-list/payment-list.component';
import {ChildrenListComponent} from "./children/children-list/children-list.component";
import {ChildrenEditComponent} from "./children/children-edit/children-edit.component";
import {SharedModule} from "../shared/shared.module";
import {ConfirmationModalComponent} from "../shared/modals/confirmation-modal/confirmation-modal.component";
import {AdminExtensionRequestComponent} from './request/admin-extension-request/admin-extension-request.component';
import {AdminRegistrationRequestComponent} from "./request/admin-registration-request/admin-registration-request.component";

@NgModule({
  declarations: [
    AdminComponent,
    ChildrenListComponent,
    ChildrenEditComponent,
    ClassBookComponent,
    PaymentListComponent,
    RequestListComponent,
    RequestEditComponent,
    TeacherListComponent,
    TeacherEditComponent,
    AdminRegistrationRequestComponent,
    AdminExtensionRequestComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule
  ],
  providers: [
    ConfirmationModalComponent
  ]
})
export class AdminModule {
}
