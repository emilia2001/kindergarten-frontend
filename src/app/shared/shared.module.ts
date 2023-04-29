import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {LoginComponent} from "./login/login.component";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {AppRoutingModule} from "../app-routing.module";
import { AnnouncementListComponent } from './announcement/announcement-list/announcement-list.component';
import { AnnouncementEditComponent } from './announcement/announcement-edit/announcement-edit.component';
import {FilterChildrenPipe} from "./pipes/filter-children.pipe";
import { HomepageComponent } from './homepage/homepage.component';
import { PaymentStatusPipe } from './pipes/payment-status.pipe';
import { FilterPaymentsPipe } from './pipes/filter-payments.pipe';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';



@NgModule({
  declarations: [
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    AnnouncementListComponent,
    AnnouncementEditComponent,
    FilterChildrenPipe,
    HomepageComponent,
    PaymentStatusPipe,
    FilterPaymentsPipe,
    ConfirmationModalComponent
  ],
    exports: [
        HeaderComponent,
        FooterComponent,
        FilterChildrenPipe,
        PaymentStatusPipe,
        FilterPaymentsPipe,
        ConfirmationModalComponent
    ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
