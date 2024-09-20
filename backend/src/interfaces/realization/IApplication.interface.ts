import { NotRequireID } from "@astypes/helperpath/helpertypes"
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo"
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo"
import { ClientInfo } from "@astypes/clientinfo/clientinfo"
import { AdminInfo } from "@astypes/admininfo/admininfo"
import { PositiveInteger } from "@astypes/positiveinteger"

export interface IApplication {
    create: (info: NotRequireID<ApplicationInfo>, 
        initiator: ClientInfo | MechanicInfo) => Promise<undefined>;
    update: (info: ApplicationInfo, initiator: MechanicInfo | AdminInfo) => Promise<undefined>;
    search(info:  Partial<ApplicationInfo>, 
        initiator: AdminInfo | MechanicInfo | ClientInfo,
        pass?: number, count?: number): Promise<ApplicationInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ApplicationInfo[]>;
}