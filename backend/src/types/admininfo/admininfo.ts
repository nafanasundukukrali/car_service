import { UserInfo, UserRoles } from "../userinfo/userinfo";

export type AdminInfo = UserInfo & {type: UserRoles.admin};