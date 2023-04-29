import {IGroupDto} from "./IGroup";
import {IParentDto} from "./IParent";

export interface IChild {
  cnp: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  picture: string
  group: IGroupDto;
  parent?: IParentDto;
}
