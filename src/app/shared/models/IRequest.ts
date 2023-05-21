import {IChild} from "./IChild";

export interface IRegistrationRequest {
  id?: number;
  applicationForm: string;
  parentIdentityCard: string;
  extraDocuments: string;
  childBirthCertificate: string;
  parentsEmployeeCertificates: string;
  comments?: string;
  status: ERequestStatus;
  child: IChild;
  isCollapsed?: boolean;
}

export interface IExtensionRequest {
  id?: number;
  applicationForm: string;
  comments?: string;
  status: ERequestStatus;
  child: IChild;
  isCollapsed?: boolean;
}

export enum ERequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ONGOING = 'ONGOING'
}
