import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule} from '@angular/common/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {CurrencyPipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AngularFireModule } from '@angular/fire/compat';

import {PdfViewerModule } from 'ng2-pdf-viewer';
import {NgbAccordionDirective, NgbCollapse, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AccordionModule} from "ngx-bootstrap/accordion";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxCurrencyModule} from "ngx-currency";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BasicAuthInterceptor} from "./interceptors/basic-auth.interceptor";
import {AdminModule} from "./admin/admin.module";
import {SharedModule} from "./shared/shared.module";
import { environment } from '../environments/environment';
import {ParentModule} from "./parent/parent.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,
    ParentModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    PdfViewerModule,
    ReactiveFormsModule,
    NgbAccordionDirective,
    NgbCollapse,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule,
    BsDropdownModule,
    NgbModule,
    NgxCurrencyModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true,
    },
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
