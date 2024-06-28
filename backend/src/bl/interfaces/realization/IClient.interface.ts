import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IClient 
{
    create: (info: NotRequireID<Required<ClientInfo>>, today: Date) => Promise<undefined>;
    update: (info: ClientInfo, initiator: AdminInfo | ClientInfo, today?: Date) => Promise<undefined>;
    search: (info: Partial<ClientInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo) => Promise<ClientInfo[]>;
    getListOfAll: (initiator: AdminInfo | MechanicInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<ClientInfo[]>;
}