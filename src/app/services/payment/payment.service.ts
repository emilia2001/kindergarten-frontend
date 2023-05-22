import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {all, api, update, payment, charge, chargeByAdmin} from "../../shared/utils/endpoints";
import {IPayment} from "../../shared/models/IPayment";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  getAllForMonth(month: string): Observable<IPayment[]> {
    return this._httpClient.get<IPayment[]>(`${api}${payment}${all}/month/${month}`);
  }

  getAllForParent(id: number): Observable<IPayment[]> {
    return this._httpClient.get<IPayment[]>(`${api}${payment}${all}/id/${id}`);
  }

  update(id: number | undefined, paymentDto: IPayment): Observable<any> {
    return this._httpClient.put(`${api}${payment}${update}/${id}`, paymentDto);
  }

  charge(amount: number, token: string, paymentId: number): Observable<any> {
    return this._httpClient.post(`${api}${payment}${charge}`, {
      amount, token, paymentId
    });
  }

  chargeByAdmin(amount: number, paymentId: number): Observable<any> {
    return this._httpClient.put(`${api}${payment}${chargeByAdmin}`, {
      amount, paymentId
    });
  }
}
