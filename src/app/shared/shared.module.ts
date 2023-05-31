import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {PdfViewerModule} from "ng2-pdf-viewer";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {SlickCarouselModule} from "ngx-slick-carousel";

import {LoginComponent} from "./login/login.component";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {AppRoutingModule} from "../app-routing.module";
import {AnnouncementListComponent} from './announcement/announcement-list/announcement-list.component';
import {AnnouncementEditComponent} from './announcement/announcement-edit/announcement-edit.component';
import {FilterChildrenPipe} from "./pipes/filter-children.pipe";
import {HomepageComponent} from './homepage/homepage.component';
import {PaymentStatusPipe} from './pipes/payment-status.pipe';
import {FilterPaymentsPipe} from './pipes/filter-payments.pipe';
import {ConfirmationModalComponent} from './modals/confirmation-modal/confirmation-modal.component';
import {PdfViewerComponent} from './pdf-viewer/pdf-viewer.component';
import { PreviousMonthPipe } from './pipes/previous-month.pipe';
import { ComputeAgePipe } from './pipes/compute-age.pipe';
import { RequestTypePipe } from './pipes/request-type.pipe';
import { RequestStatusPipe } from './pipes/request-status.pipe';
import { GroupTypePipe } from './pipes/group-type.pipe';


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
    ConfirmationModalComponent,
    PdfViewerComponent,
    PreviousMonthPipe,
    ComputeAgePipe,
    RequestTypePipe,
    RequestStatusPipe,
    GroupTypePipe,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FilterChildrenPipe,
    PaymentStatusPipe,
    FilterPaymentsPipe,
    ConfirmationModalComponent,
    PdfViewerComponent,
    PreviousMonthPipe,
    ComputeAgePipe,
    RequestTypePipe,
    RequestStatusPipe,
    GroupTypePipe
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    NgbCarouselModule,
    SlickCarouselModule
  ]
})
export class SharedModule {
}
