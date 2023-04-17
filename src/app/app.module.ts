import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './shared/footer/footer.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BasicAuthInterceptor} from "./interceptors/basic-auth.interceptor";
import {UserComponent} from './user/user.component';
import {HeaderComponent} from './shared/header/header.component';
import {AdminModule} from "./admin/admin.module";
import {ChildrenModule} from "./children/children.module";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    UserComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,
    ChildrenModule
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
