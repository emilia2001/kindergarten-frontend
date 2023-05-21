import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";

import {attendance, all, api, add} from "../../shared/utils/endpoints";
import {IAttendance} from "../../shared/models/IAttendance";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  getAllForMonth(month: string): Observable<IAttendance[]> {
    return this._httpClient.get<IAttendance[]>(`${api}${attendance}${all}/${month}`)}

  saveAll(attendances: IAttendance[]): Observable<any> {
    return this._httpClient.post(`${api}${attendance}${add}`, attendances);
  }
}
