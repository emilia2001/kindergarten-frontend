import {Component} from '@angular/core';

import {TeacherService} from "../../../services/teacher/teacher.service";
import {ITeacher} from "../../../shared/models/ITeacher";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent {
  teacherList: ITeacher[] = [];
  sortKey: string = '';
  sortAsc: boolean = true;
  currentPage: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedTeacherList: ITeacher[] = [];

  constructor(
    private _teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.refreshGroupList();
  }

  refreshGroupList() {
    this._teacherService.getAll().subscribe(
      response => {
        this.teacherList = response;
        this.updatePagination();
      }
    )
  }

  updatePagination() {
    this.currentPage = 1;

    // Apply search filter to the original childrenList
    let newTeacherList: ITeacher[] = this.teacherList;

    if (this.sortAsc) {
      newTeacherList.sort((a, b) => {
        if (a.lastName > b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName > b.firstName ? 1 : -1;
        return -1;
      })
    } else {
      newTeacherList.sort((a, b) => {
        if (a.lastName < b.lastName)
          return 1;
        if (a.lastName == b.lastName)
          return a.firstName < b.firstName ? 1 : -1;
        return -1;
      })
    }

    this.totalItems = newTeacherList.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.paginatedTeacherList = this.applyPagination(newTeacherList);

  }

  applyPagination(list: any[]): ITeacher[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return list.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedTeacherList = this.applyPagination(this.teacherList);
    }
  }

}
