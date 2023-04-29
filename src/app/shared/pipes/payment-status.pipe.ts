import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus'
})
export class PaymentStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    switch (value) {
      case "UNPAID":
        return 'Neplatita';
      case "PAID":
        return 'Platita';
      default:
        return '';
    }
  }

}
