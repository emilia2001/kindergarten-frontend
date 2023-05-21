import {IGroupDto} from "./IGroup";

export interface ITeacher {
  dateOfBirth: Date;
  id?: number;
  firstName: string;
  lastName: string;
  description: string;
  picturePath: string;
  groupDto: IGroupDto;
}

export interface ITeacherAdd {
  id?: number;
  firstName: string;
  lastName: string;
  description: string;
  dateOfBirth: Date;
  groupId: number;
  picturePath: string;
}
