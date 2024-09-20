import { UserInfo } from "@astypes/userinfo/userinfo";
import { UserRoles } from "../userinfo/userinfo";
import { MechanicStatus } from "../mechanicstatus/mechanicstatus";

export type MechanicInfo = UserInfo & {type: UserRoles.mechanic, status?: MechanicStatus};