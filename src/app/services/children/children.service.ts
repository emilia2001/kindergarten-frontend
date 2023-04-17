import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IChild} from "../../shared/models/IChild";

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getChildren() {
    let basicAuthHeader = this.createAuthenticationHttpHeader();
    // let headers = new HttpHeaders({
    //   Authorization: basicAuthHeader
    // })
    return this._httpClient.get<IChild[]>("http://localhost:8080/admin/children",
      // {headers: headers}
    );
  }

  deleteChild(id?: number) {
    return this._httpClient.delete(`http://localhost:8080/admin/children/${id}`);
  }

  retrieveChild(id: number) {
    return this._httpClient.get<IChild>(`http://localhost:8080/admin/children/${id}`);
  }

  updateChild(id: number, child: IChild) {
    return this._httpClient.put(
      `http://localhost:8080/admin/children/${id}`
      , child);
  }

  createChild(child: IChild) {
    return this._httpClient.post(
      `http://localhost:8080/admin/children`
      , child);
  }

  createAuthenticationHttpHeader() {
    let username = 'a';
    let password = 'a';
    let basicAuthHeaderString = 'Basic ' + window.btoa(`${username}:${password}`);
    return basicAuthHeaderString;
  }
}
