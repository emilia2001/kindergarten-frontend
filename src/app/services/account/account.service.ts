import {Injectable} from '@angular/core';
import {map, Observable, of, switchMap, throwError} from "rxjs";
import {IChild} from "../../shared/models/IChild";
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {environment} from 'src/environments/environment';
import {IAdminLoginData} from "../../shared/models/IAdminLoginData";
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _apiUrl = environment.apiEndpoint;

  constructor(private _httpClient: HttpClient,
              private _cookieService: CookieService) {
  }

  loginAdmin$(username: string, password: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiUrl}/login`, {
        username, password, role: "ADMIN"
      })
      // .pipe(
      //   map(
      //     data => {
      //       console.log(data)
      //       this._cookieService.set('Token', data.token)
      //     }
      //   )
      // );
  }

  getAuthenticatedToken() {
      return this._cookieService.get("Token");
  }

  getIsAdminLoggedIn(): boolean {
    return this._cookieService.get("Token") !== '';
  }

  logout() {
    this._cookieService.delete('Token');
  }
}

export class AuthenticationBean {
  constructor(public message: string) {
  }
}
