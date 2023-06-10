import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {all, api, paymentConfirmation, add, nextId} from "../../shared/utils/endpoints";
import {IPaymentConfirmation} from "../../shared/models/IPaymentConfirmation";

@Injectable({
  providedIn: 'root'
})
export class PaymentConfirmationService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll(): Observable<IPaymentConfirmation[]> {
    return this._httpClient.get<IPaymentConfirmation[]>(`${api}${paymentConfirmation}${all}`);
  }

  getAllForParent(id: number): Observable<IPaymentConfirmation[]> {
    return this._httpClient.get<IPaymentConfirmation[]>(`${api}${paymentConfirmation}${all}/${id}`);
  }

  add(paymentConfirmationDto: IPaymentConfirmation): Observable<any> {
    return this._httpClient.post<any>(`${api}${paymentConfirmation}${add}`, paymentConfirmationDto);
  }

  getNextId(): Observable<any> {
    return this._httpClient.get<{id: number}>(`${api}${paymentConfirmation}${nextId}`);
  }

}
