import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {IChild} from "../../shared/models/IChild";
import {all, api, children, get, update, add, deleteEnd} from "../../shared/utils/endpoints";

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll(): Observable<IChild[]> {
    return this._httpClient.get<IChild[]>(`${api}${children}${all}`);
  }

  deleteChild(child: IChild): Observable<any> {
    return this._httpClient.put(`${api}${children}${deleteEnd}`, child);
  }

  getOneById(id: string): Observable<IChild> {
    return this._httpClient.get<IChild>(`${api}${children}${get}/${id}`);
  }

  update(id: string, child: IChild): Observable<any> {
    return this._httpClient.put(`${api}${children}${update}`, child);
  }

  add(child: IChild): Observable<any> {
    return this._httpClient.post(`${api}${children}${add}`, child);
  }

  addChild(child: IChild): Observable<any> {
    return this._httpClient.post(`${api}${children}${add}`, child);

  }
}
