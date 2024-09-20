import { Id } from "../id/id";

export enum UserRoles {
  none='no user',
  admin='admin',
  mechanic='mechanic',
  client='client'
}

export type UserInfo  = {
  fio?: string,
  email?: string,
  id: Id,
  password ?: string,
  type: UserRoles,
};
