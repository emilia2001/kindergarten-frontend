import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {all, api, update, payment} from "../../shared/utils/endpoints";
import {IPayment} from "../../shared/models/IPayment";
import {IChild} from "../../shared/models/IChild";

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

  charge2() {
    console.log("pl")
    return this._httpClient.get<IPayment[]>(`${api}${payment}${all}`);

  }

  charge(amount: number, token: string, paymentId: number): Observable<any> {
    console.log("service")
    console.log(`${api}${payment}/charge`);
    console.log({
      amount, token
    })
    // return this._httpClient.get<IPayment[]>(`${api}${payment}${all}`);

    return this._httpClient.post(`${api}${payment}/charge`, {
      amount, token, paymentId
    });
  }
}
