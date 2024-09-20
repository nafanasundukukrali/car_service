import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { ServiceInfo } from "@astypes/serviceinfo/serviceinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { PositiveInteger } from "@astypes/positiveinteger"

export interface IService {
    search: (info:  Partial<ServiceInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo | undefined,
        pass?: number, count?: number) => Promise<ServiceInfo []>;
    getListOfAll: (initiator: AdminInfo | ClientInfo | MechanicInfo | undefined, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ServiceInfo[]>;
}