import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {all, api, announcement, deleteEnd, add, update, get} from "../../shared/utils/endpoints";
import {IAnnouncement} from "../../shared/models/IAnnouncement";

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll(): Observable<IAnnouncement[]> {
    return this._httpClient.get<IAnnouncement[]>(`${api}${announcement}${all}`);
  }

  delete(id: number | undefined) {
    return this._httpClient.delete(`${api}${announcement}${deleteEnd}/${id!.toString()}`);
  }

  add(announcementDto: IAnnouncement) {
    return this._httpClient.post(`${api}${announcement}${add}`, announcementDto);
  }

  update(announcementDto: IAnnouncement) {
    return this._httpClient.put(`${api}${announcement}${update}`, announcementDto);
  }

  getOneById(id: number) : Observable<IAnnouncement> {
    return this._httpClient.get<IAnnouncement>(`${api}${announcement}${get}/${id}`)
  }
}
