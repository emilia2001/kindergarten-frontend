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

  constructor(
    private _teacherService: TeacherService
  ) {
  }

  ngOnInit() {
    this.refreshGroupList();
    console.log(this.teacherList)
  }

  refreshGroupList() {
    this._teacherService.getAll().subscribe(
      response => {
        this.teacherList = response;
      }
    )
  }
}
