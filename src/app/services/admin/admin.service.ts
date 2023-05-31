import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {admin, add, api} from "../../shared/utils/endpoints";
import {IAdmin} from "../../shared/models/IAdmin";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  add(adminDto: IAdmin) {
    return this._httpClient.post(`${api}${admin}${add}`, adminDto);
  }
}
