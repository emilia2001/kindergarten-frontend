import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {Observable} from 'rxjs';
import jwt_decode from "jwt-decode";

import {AccountService} from "../services/account/account.service";
import {Role} from "../shared/models/IAdminLoginData";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this._accountService.getAuthenticatedToken();
    // @ts-ignore
    return !token ? true : jwt_decode(token)['role'] == Role.ADMIN ? this._router.navigate(["/admin"]) : this._router.navigate(["/"]);
  }
}
