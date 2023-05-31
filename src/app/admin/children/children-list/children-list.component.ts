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

   constructor(
    private _childrenService: ChildrenService,
    private _router: Router
  ) { }

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

  // deleteChild(id?: number) {
  //   this._childrenService.deleteChild( id).subscribe(
  //     response => {
  //       this.message = `Delete of Child ${id} Successful!`;
  //       this.refreshChildrenList();
  //     }
  //   )
  // }

  updateChild(id?: number) {
    this._router.navigate(['admin/children', id])
  }

  handleViewChild(child: IChild) {
    this._router.navigate(['admin/children', child.cnp])
  }
}
