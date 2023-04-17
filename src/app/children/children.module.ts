import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChildrenListComponent} from "./children-list/children-list.component";
import {ChildrenEditComponent} from "./children-edit/children-edit.component";
import {AppRoutingModule} from "../app-routing.module";
import {FilterChildrenPipe} from "../shared/pipes/filter-children.pipe";



@NgModule({
  declarations: [
    ChildrenListComponent,
    ChildrenEditComponent,
    FilterChildrenPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

  ]
})
export class ChildrenModule { }
