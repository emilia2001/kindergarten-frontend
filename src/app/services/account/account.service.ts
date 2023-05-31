import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import jwt_decode from "jwt-decode";

import {Role} from "../../shared/models/IAdminLoginData";
import {api, login, register} from "../../shared/utils/endpoints";
import {IParentDto} from "../../shared/models/IParent";


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _httpClient: HttpClient,
              private _cookieService: CookieService) {}

  login$(username: string, password: string, role: Role): Observable<any> {
    return this._httpClient.post<any>(
      `${api}${login}`, {
        username, password, role
      })
      .pipe(
        map(
          data => {
            this._cookieService.set('Token', data.token)
            return data;
          }
        )
      );
  }

  register(parent: IParentDto):Observable<any> {
    return this._httpClient.post<any>(`${api}${register}`, parent).pipe(
      map(
        data => {
          this._cookieService.set('Token', data.token)
          return data;
        }
      )
    );
  }

  getAuthenticatedToken(): string {
    return this._cookieService.get("Token");
  }

  getIsLoggedIn(): boolean {
    return this._cookieService.get("Token") !== '';
  }

  getIsAdminLoggedIn(): boolean {
    const token = this._cookieService.get("Token");
    // @ts-ignore
    return token !== '' && jwt_decode(token)['role'] == Role.ADMIN;
  }

  getIsParentLoggedIn(): boolean {
    const token = this._cookieService.get("Token");
    // @ts-ignore
    return token !== '' && jwt_decode(token)['role'] == Role.PARENT;

  }

  logout(): void {
    this._cookieService.deleteAll();
    this._cookieService.delete('Token');
    window.location.reload();
  }
}

