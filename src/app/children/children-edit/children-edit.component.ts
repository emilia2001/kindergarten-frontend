import {Component} from '@angular/core';
import {IChild} from "../../shared/models/IChild";
import {ChildrenService} from "../../services/children/children.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-children-edit',
  templateUrl: './children-edit.component.html',
  styleUrls: ['./children-edit.component.scss']
})
export class ChildrenEditComponent {
  id: number = 0;
  child: IChild = {group: "", id: this.id, cnp: '', birthDate: new Date(), firstName: '', lastName: ''};

  constructor(
    private _childrenService: ChildrenService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.id = this._route.snapshot.params['id'];

    this.child = {group: "", id: this.id, cnp: '', birthDate: new Date(), firstName: '', lastName: ''};

    if (this.id != -1) {
      this._childrenService.retrieveChild(this.id)
        .subscribe(
          data => this.child = data
        )
    }
  }

  saveTodo() {
    if (this.id == -1) { //=== ==
      this.child.cnp = '1';
      this.child.firstName = 'name';
      this.child.lastName = 'name';
      this._childrenService.createChild(this.child)
        .subscribe(
          data => {
            this._router.navigate(['admin/children'])
          }
        )
    } else {
      this._childrenService.updateChild(this.id, this.child)
        .subscribe(
          data => {
            this._router.navigate(['admin/children'])
          }
        )
    }
  }

}
