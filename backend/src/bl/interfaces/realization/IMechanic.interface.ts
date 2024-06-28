import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IMechanic {
    create: (info: NotRequireID<MechanicInfo>, initiator: AdminInfo) => Promise<undefined>;
    update: (info: MechanicInfo, initiator: AdminInfo) => Promise <undefined>;
    archive: (info: MechanicInfo, initiatir: AdminInfo) => Promise<undefined>;
    unarchive: (info: MechanicInfo, initiatir: AdminInfo) => Promise<undefined>;
    search: (info:  Partial<MechanicInfo>, initiator: AdminInfo | MechanicInfo, pass?: number, count?: number) => Promise<MechanicInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<MechanicInfo[]>;
}