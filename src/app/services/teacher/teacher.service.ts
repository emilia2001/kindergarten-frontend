import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {map, Observable} from "rxjs";

import {ITeacher, ITeacherAdd} from "../../shared/models/ITeacher";
import {add, all, api, get, teacher, update} from "../../shared/utils/endpoints";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll(): Observable<ITeacher[]> {
    return this._httpClient.get<ITeacher[]>(`${api}${teacher}${all}`)
  }

  add(teacherAddDto: ITeacherAdd): Observable<any> {
    return this._httpClient.post<any>(`${api}${teacher}${add}`, teacherAddDto);
  }

  update(id: number, teacherDto: ITeacherAdd): Observable<any> {
    return this._httpClient.put<any>(`${api}${teacher}${update}`, teacherDto);
  }

  getOneById(id: number): Observable<ITeacherAdd> {
    return this._httpClient.get<ITeacher>(`${api}${teacher}${get}/${id}`).pipe(
      map((teacher: ITeacher) => {
        return {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          description: teacher.description,
          dateOfBirth: teacher.dateOfBirth,
          groupId: teacher.groupDto.id!,
          picturePath: teacher.picturePath
        };
      }));
  }
}
