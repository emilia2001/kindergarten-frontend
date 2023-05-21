export interface IGroup {
  id?: number;
  name: string;
  capacity: string;
  groupType: EGroupType;
}

export enum EGroupType {
  JUNIOR = 'JUNIOR',
  MIDDLE = 'MIDDLE',
  SENIOR = 'SENIOR'
}

export interface IGroupDto {
  id?: number;
  name: string;
  groupType?: EGroupType
}

export interface IGroupSpotsDto {
  availableCount: number;
  unavailableCount: number;
  pendingCount: number;
}
