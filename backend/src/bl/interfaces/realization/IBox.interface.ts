import { BoxInfo } from "@bltypes/boxinfo/boxinfo"
import { AdminInfo } from "@bltypes/admininfo/admininfo"
import { ClientInfo } from "@bltypes/clientinfo/clientinfo"
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo"
import { NotRequireID } from "@bltypes/helperpath/helpertypes"
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IBox {
    search: (info:  Partial<BoxInfo>, 
                                    initiator: AdminInfo | ClientInfo | MechanicInfo,
                                    pass?: number, count?: number) =>Promise<BoxInfo []>;

    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<BoxInfo[]>;
}