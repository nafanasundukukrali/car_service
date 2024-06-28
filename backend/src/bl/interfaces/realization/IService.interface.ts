import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { ServiceInfo } from "@bltypes/serviceinfo/serviceinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IService {
    search: (info:  Partial<ServiceInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo | undefined,
        pass?: number, count?: number) => Promise<ServiceInfo []>;
    getListOfAll: (initiator: AdminInfo | ClientInfo | MechanicInfo | undefined, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ServiceInfo[]>;
}