import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestType'
})
export class RequestTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value === 'PENDING')
      return 'Neprocesată'
    if (value === 'ONGOING')
      return 'În procesare'
    if (value === 'APPROVED')
      return 'Aprobată'
    if (value === 'REJECTED')
      return 'Respinsă'
    return ''
  }

}
