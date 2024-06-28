import { UserInfo, UserRoles } from "@bltypes/userinfo/userinfo";

export type ClientInfo = UserInfo & {type: UserRoles.client, "dateBIrth" ?: Date, "phone" ?: string};
