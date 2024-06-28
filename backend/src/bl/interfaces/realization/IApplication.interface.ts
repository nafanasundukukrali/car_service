import { NotRequireID } from "@bltypes/helperpath/helpertypes"
import { ApplicationInfo } from "@bltypes/applicationinfo/applicationinfo"
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo"
import { ClientInfo } from "@bltypes/clientinfo/clientinfo"
import { AdminInfo } from "@bltypes/admininfo/admininfo"
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IApplication {
    create: (info: NotRequireID<ApplicationInfo>, 
        initiator: ClientInfo | MechanicInfo) => Promise<undefined>;
    update: (info: ApplicationInfo, initiator: MechanicInfo | AdminInfo) => Promise<undefined>;
    search(info:  Partial<ApplicationInfo>, 
        initiator: AdminInfo | MechanicInfo | ClientInfo,
        pass?: number, count?: number): Promise<ApplicationInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ApplicationInfo[]>;
}