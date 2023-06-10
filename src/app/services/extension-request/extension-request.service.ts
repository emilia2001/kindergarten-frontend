import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";

import {IExtensionRequest, IRegistrationRequest} from "../../shared/models/IRequest";
import {
  add,
  all,
  api,
  extensionRequest,
  get,
  updateByAdmin,
  updateByParent
} from "../../shared/utils/endpoints";

@Injectable({
  providedIn: 'root'
})
export class ExtensionRequestService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  addRequest(request: IExtensionRequest): Observable<any> {
    return this._httpClient.post(`${api}${extensionRequest}${add}`, request);
  }

  updateRequestByAdmin(request: IExtensionRequest): Observable<any> {
    return this._httpClient.put(`${api}${extensionRequest}${updateByAdmin}`, request);
  }

  updateRequestByParent(request: IExtensionRequest): Observable<any> {
    return this._httpClient.put(`${api}${extensionRequest}${updateByParent}`, request);
  }

  getAllForParent(id: number): Observable<IExtensionRequest[]> {
    return this._httpClient.get<IExtensionRequest[]>(`${api}${extensionRequest}${all}/${id}`).pipe(map(data => {
        data.forEach(request => request.isCollapsed = true);
        return data;
      }
    ));
  }

  getOneById(id: number): Observable<IExtensionRequest> {
    return this._httpClient.get<IRegistrationRequest>(`${api}${extensionRequest}${get}/${id}`);
  }

  getAll() {
    return this._httpClient.get<IExtensionRequest[]>(`${api}${extensionRequest}${all}`);
  }
}
