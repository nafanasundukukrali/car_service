import { UserInfo, UserRoles } from "@bltypes/userinfo/userinfo";

export type AdminInfo = UserInfo & {type: UserRoles.admin};