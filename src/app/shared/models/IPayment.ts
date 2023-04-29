import {IChild} from "./IChild";

export interface IPayment {
  id?: number,
  child: IChild;
  outstandingAmount: number,
  currentAmount: number,
  totalAmount: number,
  status: EPaymentStatus
}

export enum EPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}
