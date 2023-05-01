import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BasicAuthInterceptor} from "./interceptors/basic-auth.interceptor";
import {ParentComponent} from './parent/parent.component';
import {AdminModule} from "./admin/admin.module";
import {SharedModule} from "./shared/shared.module";
import { SubmittedRequestsListComponent } from './parent/request/submitted-requests-list/submitted-requests-list.component';
import { NewRequestComponent } from './parent/request/new-request/new-request.component';
import { ParentPaymentListComponent } from './parent/payment/parent-payment-list/parent-payment-list.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CancelPaymentComponent } from './parent/payment/cancel-payment/cancel-payment.component';
import { SuccessPaymentComponent } from './parent/payment/success-payment/success-payment.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ParentComponent,
    SubmittedRequestsListComponent,
    NewRequestComponent,
    ParentPaymentListComponent,
    CancelPaymentComponent,
    SuccessPaymentComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        AdminModule,
        SharedModule,
        FormsModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
