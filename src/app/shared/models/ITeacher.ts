import {IGroupDto} from "./IGroup";

export interface ITeacher {
  dateOfBirth: Date;
  id?: number;
  firstName: string;
  lastName: string;
  description: string;
  picture: string;
  groupDto: IGroupDto;
}

export interface ITeacherAdd {
  id?: number;
  firstName: string;
  lastName: string;
  description: string;
  dateOfBirth: Date;
  groupId: number;
  picture: string;
}
