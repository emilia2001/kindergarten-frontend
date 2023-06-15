import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

import {ChildrenService} from "../../../services/children/children.service";
import {IChild} from "../../../shared/models/IChild";
import {GroupService} from "../../../services/group/group.service";
import {IGroup} from "../../../shared/models/IGroup";

@Component({
  selector: 'app-children-list',
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent implements OnInit {
  childrenList: IChild[] = [];
  allChildrenList: IChild[] = [];
  message: string = '';
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  sortKey: string = '';
  sortAsc: boolean = true;
  currentPage: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedChildrenList: any[] = [];
  groupList: IGroup[] = [];
  currentGroup: number = 0;

  constructor(
    private _childrenService: ChildrenService,
    private _groupService: GroupService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._groupService.getAll().subscribe(data => this.groupList = data);
    this.refreshChildrenList();
  }

  refreshChildrenList() {
    this._childrenService.getAll().subscribe(
      response => {
        this.childrenList = response;
        this.allChildrenList = response;
        this.updatePaginationAndFiltering();
      }
    )
  }

  handleGroupChange($event: any) {
    this.currentPage = 1;
    this.currentGroup = $event.target.value;
    if ($event.target.value == 0)
      this.childrenList = this.allChildrenList;
    else
      this.childrenList = this.allChildrenList.filter(child => child.group.id == $event.target.value);
    this.updatePaginationAndFiltering();
  }

  updateChild(id?: number) {
    this._router.navigate(['admin/children', id])
  }

  handleViewChild(child: IChild) {
    this._router.navigate(['admin/children', child.cnp])
  }

  updatePaginationAndFiltering() {
    this.currentPage = 1;

    const searchValue = this.searchForm.get('search')!.value!.toLowerCase();
    let filteredChildrenList;
    if (this.currentGroup != 0) {
      filteredChildrenList = this.allChildrenList.filter(child =>{
        return (child.firstName.toLowerCase().includes(searchValue) ||
          child.lastName.toLowerCase().includes(searchValue)) && child.group.id == this.currentGroup
      }
      );
    } else {
      filteredChildrenList = this.allChildrenList.filter(child =>
        child.firstName.toLowerCase().includes(searchValue) ||
          child.lastName.toLowerCase().includes(searchValue)
      );
    }

    if (this.sortAsc) {
      filteredChildrenList.sort((a, b) => {
        if (a.lastName > b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName > b.firstName ? 1 : -1;
        return -1;
      })
    } else {
      filteredChildrenList.sort((a, b) => {
        if (a.lastName < b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName < b.firstName ? 1 : -1;
        return -1;
      })
    }

    this.totalItems = filteredChildrenList.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.paginatedChildrenList = this.applyPagination(filteredChildrenList);

  }

  applyPagination(list: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return list.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedChildrenList = this.applyPagination(this.childrenList);
    }
  }
}
