import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'computeAge'
})
export class ComputeAgePipe implements PipeTransform {

  transform(birthdate: Date, ...args: unknown[]): unknown {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const diff = today.getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  }

}
