import { Pipe, PipeTransform } from '@angular/core';

import {IChild} from "../models/IChild";

@Pipe({
  name: 'filterChildren'
})
export class FilterChildrenPipe implements PipeTransform {

  transform(children: IChild[], searchText: string): IChild[] {
    if (!children) {
      return [];
    }
    if (!searchText) {
      return children;
    }
    searchText = searchText.toLowerCase();
    return children.filter(child => {
      return child.firstName.toLowerCase().includes(searchText) ||
        child.lastName.toLowerCase().includes(searchText)
    });
  }
}
