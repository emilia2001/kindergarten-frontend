import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {IGroup, IGroupSpotsDto} from "../../shared/models/IGroup";
import {all, api, group, spots} from "../../shared/utils/endpoints";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll(): Observable<IGroup[]> {
    return this._httpClient.get<IGroup[]>(`${api}${group}${all}`);
  }

  getSpotsInformationById(groupId: number): Observable<IGroupSpotsDto> {
    return this._httpClient.get<IGroupSpotsDto>(`${api}${group}${spots}/${groupId}`);
  }
}
