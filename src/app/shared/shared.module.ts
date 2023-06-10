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
import {PdfViewerComponent} from './pdf-viewer/pdf-viewer.component';
import {PreviousMonthPipe} from './pipes/previous-month.pipe';
import {ComputeAgePipe} from './pipes/compute-age.pipe';
import {RequestTypePipe} from './pipes/request-type.pipe';
import {RequestStatusPipe} from './pipes/request-status.pipe';
import {GroupTypePipe} from './pipes/group-type.pipe';
import {OrderByPipe} from './pipes/order-by.pipe';
import {RomanianMonthPipe} from './pipes/romanian-month.pipe';
import {GoogleMapsModule} from "@angular/google-maps";
import {ExtensionRequestComponent} from "./request/extension-request/extension-request.component";
import {RegistrationRequestComponent} from "./request/registration-request/registration-request.component";


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
    PdfViewerComponent,
    PreviousMonthPipe,
    ComputeAgePipe,
    RequestTypePipe,
    RequestStatusPipe,
    GroupTypePipe,
    OrderByPipe,
    RomanianMonthPipe,
    ExtensionRequestComponent,
    RegistrationRequestComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FilterChildrenPipe,
    PaymentStatusPipe,
    FilterPaymentsPipe,
    PdfViewerComponent,
    PreviousMonthPipe,
    ComputeAgePipe,
    RequestTypePipe,
    RequestStatusPipe,
    GroupTypePipe,
    OrderByPipe,
    RomanianMonthPipe,
    RegistrationRequestComponent,
    ExtensionRequestComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    NgbCarouselModule,
    SlickCarouselModule,
    GoogleMapsModule
  ]
})
export class SharedModule {
}
