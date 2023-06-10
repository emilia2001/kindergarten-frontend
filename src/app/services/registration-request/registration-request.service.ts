import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";

import {IRegistrationRequest} from "../../shared/models/IRequest";
import {
  add,
  all,
  api,
  get,
  registrationRequest,
  updateByAdmin,
  updateByParent
} from "../../shared/utils/endpoints";

@Injectable({
  providedIn: 'root'
})
export class RegistrationRequestService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  addRequest(request: IRegistrationRequest): Observable<any> {
    return this._httpClient.post(`${api}${registrationRequest}${add}`, request);
  }

  updateRequestByAdmin(request: IRegistrationRequest): Observable<any> {
    return this._httpClient.put(`${api}${registrationRequest}${updateByAdmin}`, request);
  }

  updateRequestByParent(request: IRegistrationRequest): Observable<any> {
    return this._httpClient.put(`${api}${registrationRequest}${updateByParent}`, request);
  }

  getAllForParent(id: number): Observable<IRegistrationRequest[]> {
    return this._httpClient.get<IRegistrationRequest[]>(`${api}${registrationRequest}${all}/${id}`).pipe(map(data => {
      data.forEach(request => request.isCollapsed = true);
      return data;
      }
    ));
  }

  getOneById(id: number): Observable<IRegistrationRequest> {
    return this._httpClient.get<IRegistrationRequest>(`${api}${registrationRequest}${get}/${id}`);
  }

  getAll() {
    return this._httpClient.get<IRegistrationRequest[]>(`${api}${registrationRequest}${all}`);
  }
}
