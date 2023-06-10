import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {Observable} from 'rxjs';

import {AccountService} from "../services/account/account.service";
import {Role} from "../shared/models/IAdminLoginData";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const role: Role = state.url.includes('admin') ? Role.ADMIN : Role.PARENT;
    return this._accountService.getAuthenticatedToken() ? true : role == Role.ADMIN ? this._router.createUrlTree(['/admin/login']) : this._router.createUrlTree(['/login']);
  }

}
