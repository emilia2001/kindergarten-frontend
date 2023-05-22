import {IChild} from "./IChild";

export interface IPayment {
  id?: number,
  child: IChild;
  outstandingAmount: number,
  currentAmount: number,
  totalUnpaidAmount: number,
  totalAmount: number,
  month: string,
  status: EPaymentStatus
}

export enum EPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}
