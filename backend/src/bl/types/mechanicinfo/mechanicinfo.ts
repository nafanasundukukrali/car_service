import { UserInfo, UserRoles } from "@bltypes/userinfo/userinfo";
import { MechanicStatus } from "../mechanicstatus/mechanicstatus";

export type MechanicInfo = UserInfo & {type: UserRoles.mechanic, status?: MechanicStatus};