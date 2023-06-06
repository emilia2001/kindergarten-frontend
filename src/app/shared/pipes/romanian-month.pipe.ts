import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'romanianMonth'
})
export class RomanianMonthPipe implements PipeTransform {

  transform(value: string | null): string {
    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];

    const dateParts = value!.split('-');
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const monthName = months[monthIndex];
console.log(`${monthName} ${year}`)
    return `${monthName}-${year}`;
  }

}
