export interface ILoginData {
  username?: string;
  password?: string;
  role?: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT'
}
