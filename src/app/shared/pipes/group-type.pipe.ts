import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupType'
})
export class GroupTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value === 'JUNIOR')
      return 'Mică'
    if (value === 'MIDDLE')
      return 'Mijlocie'
    if (value === 'SENIOR')
      return 'Mare'
    return ''
  }

}
