import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from "../services/account/account.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this._accountService.getAuthenticatedToken();
    // if(!token) {
    //   return true;
    // } else {
    //   const role = parseJwt(token).type;
    //   if (role == UserType.ADMIN) {
    //     this.router.navigate(["../admin"]);
    //   }  else if (role == UserType.EMPLOYEE) {
    //     this.router.navigate(["../employee"]);
    //   }  else if (role == UserType.TEAMLEAD) {
    //     this.router.navigate(["../teamlead"]);
    //   }
    // }
    // return false;
    return !token ? true : this._router.createUrlTree(['/admin']);
  }

}
