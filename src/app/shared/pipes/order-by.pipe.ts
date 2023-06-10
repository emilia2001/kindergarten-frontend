import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], sortKey: string, sortAsc: boolean): any[] {
    if (!Array.isArray(array) || !sortKey) {
      return array;
    }
    const sortedArray = [...array]; // Create a new array to avoid modifying the original array
    console.log(sortedArray)
    sortedArray.sort((a, b) => {
      const valueA = this.getPropertyValue(a, sortKey);
      const valueB = this.getPropertyValue(b, sortKey);

      if (valueA === valueB) {
        return 0;
      }

      if (sortAsc) {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
console.log(sortedArray)
    return sortedArray;
  }

  private getPropertyValue(obj: any, key: string): any {
    if (!obj || !key) {
      return undefined;
    }

    const keys = key.split('.');
    let value = obj;

    for (const k of keys) {
      if (value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    console.log(value)
    return value;
  }

}
