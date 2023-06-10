import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

import {ChildrenService} from "../../../services/children/children.service";
import {IChild} from "../../../shared/models/IChild";

@Component({
  selector: 'app-children-list',
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent implements OnInit {
  childrenList: IChild[] = [];
  message: string = '';
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  sortKey: string = '';
  sortAsc: boolean = true;

   constructor(
    private _childrenService: ChildrenService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.refreshChildrenList();
  }

  refreshChildrenList() {
    this._childrenService.getAll().subscribe(
      response => {
        this.childrenList = response;
      }
    )
  }

  updateChild(id?: number) {
    this._router.navigate(['admin/children', id])
  }

  handleViewChild(child: IChild) {
    this._router.navigate(['admin/children', child.cnp])
  }

  getSortingIcon(column: string): string {
    if (this.sortKey === column) {
      return this.sortAsc ? 'up' : 'down';
    }

    return 'up';
  }
}
