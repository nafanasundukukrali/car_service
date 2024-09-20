import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { PositiveInteger } from "@astypes/positiveinteger"

export interface IClient 
{
    create: (info: NotRequireID<Required<ClientInfo>>, today: Date) => Promise<undefined>;
    update: (info: ClientInfo, initiator: AdminInfo | ClientInfo, today?: Date) => Promise<undefined>;
    search: (info: Partial<ClientInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo) => Promise<ClientInfo[]>;
    getListOfAll: (initiator: AdminInfo | MechanicInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ClientInfo[]>;
}