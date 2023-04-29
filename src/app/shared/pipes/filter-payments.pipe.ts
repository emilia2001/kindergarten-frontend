import { Pipe, PipeTransform } from '@angular/core';
import {IPayment} from "../models/IPayment";

@Pipe({
  name: 'filterPayments'
})
export class FilterPaymentsPipe implements PipeTransform {

  transform(payments: IPayment[] | null, searchText: string, groupId: number): IPayment[] {
    if (!payments) {
      return [];
    }
    if (groupId == 0) {
      searchText = searchText.toLowerCase();
      return payments.filter(payment => payment.child.firstName.toLowerCase().includes(searchText) ||
        payment.child.lastName.toLowerCase().includes(searchText))
        // payment.child.group.id === groupId);
    }
    if (!searchText) {
      console.log(groupId)
      return payments.filter(payment => {
        console.log( payment.child.group.id)
        return payment.child.group.id == groupId
      });
    }
    return payments.filter(payment => (payment.child.firstName.toLowerCase().includes(searchText) ||
      payment.child.lastName.toLowerCase().includes(searchText) ) &&
    payment.child.group.id == groupId);
  }

}
