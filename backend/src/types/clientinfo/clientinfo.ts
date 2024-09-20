import { UserInfo, UserRoles } from "../userinfo/userinfo";

export type ClientInfo = UserInfo & {type: UserRoles.client, "dateBIrth" ?: Date, "phone" ?: string};
