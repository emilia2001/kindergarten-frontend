import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import {Observable} from 'rxjs';

import {AccountService} from "../services/account/account.service";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(
    private _accountService: AccountService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes("/auth")) {
      let authenticatedToken = this._accountService.getAuthenticatedToken();
      if (authenticatedToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authenticatedToken}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
