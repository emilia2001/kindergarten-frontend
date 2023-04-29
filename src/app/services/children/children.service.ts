import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {IChild} from "../../shared/models/IChild";
import {all, api, children, get, update, add, teacher} from "../../shared/utils/endpoints";

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

  deleteChild(id?: number) {
    return this._httpClient.delete(`http://localhost:8080/admin/children/${id}`);
  }

  getOneById(id: string): Observable<IChild> {
    return this._httpClient.get<IChild>(`${api}${children}${get}/${id}`);
  }

  update(id: string, child: IChild): Observable<any> {
    return this._httpClient.put(`${api}${children}${update}/${id}`, child);
  }

  add(child: IChild): Observable<any> {
    // debugger;
    // console.log(`${api}${children}${add}`)
    // return this._httpClient.get<IChild[]>(`${api}${children}${all}`);

    return this._httpClient.post(`${api}${children}${add}`, child);
  }

  addChild(child: IChild): Observable<any> {
    // return this._httpClient.get<IChild[]>(`${api}${children}${all}`);
    return this._httpClient.post(`${api}${children}${add}`, child);

  }
}
