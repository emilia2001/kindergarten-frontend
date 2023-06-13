import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

import {AppRoutingModule} from "../app-routing.module";
import {AdminComponent} from "./admin.component";
import {TeacherListComponent} from './teacher/teacher-list/teacher-list.component';
import {TeacherEditComponent} from './teacher/teacher-edit/teacher-edit.component';
import {ClassBookComponent} from './classbook/class-book.component';
import {AdminRequestListComponent} from './request/admin-request-list/admin-request-list.component';
import {AdminRequestEditComponent} from './request/admin-request-edit/admin-request-edit.component';
import {AdminPaymentListComponent} from './admin-payment-list/admin-payment-list.component';
import {ChildrenListComponent} from "./children/children-list/children-list.component";
import {ChildrenEditComponent} from "./children/children-edit/children-edit.component";
import {SharedModule} from "../shared/shared.module";
import { AddAccountComponent } from './add-account/add-account.component';
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
    declarations: [
        AdminComponent,
        ChildrenListComponent,
        ChildrenEditComponent,
        ClassBookComponent,
        AdminPaymentListComponent,
        AdminRequestListComponent,
        AdminRequestEditComponent,
        TeacherListComponent,
        TeacherEditComponent,
        AddAccountComponent,
    ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule,
    NgxPaginationModule
  ]
})
export class AdminModule {
}
