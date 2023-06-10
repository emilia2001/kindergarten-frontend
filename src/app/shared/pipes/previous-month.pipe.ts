import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'previousMonth'
})
export class PreviousMonthPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const dateParts = value.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);

    // Create a new Date object with the given year and month
    const date = new Date(year, month - 1);

    // Subtract one month from the date
    date.setMonth(date.getMonth() - 1);

    // Get the year and month of the previous month
    const previousYear = date.getFullYear();
    const previousMonth = date.getMonth() + 1;

    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];

    // Return the previous year and month as a string
    return `${months[previousMonth - 1]} ${previousYear}`;
  }


}
