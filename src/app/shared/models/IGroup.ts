export interface IGroup {
  id?: number;
  name: string;
  capacity: string;
  type: EGroupType;
}

export enum EGroupType {
  JUNIOR = 'JUNIOR',
  MIDDLE = 'MIDDLE',
  SENIOR = 'SENIOR'
}

export interface IGroupDto {
  id?: number;
  name: string;
  type?: EGroupType
}
