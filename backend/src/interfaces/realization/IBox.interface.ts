import { BoxInfo } from "@astypes/boxinfo/boxinfo"
import { AdminInfo } from "@astypes/admininfo/admininfo"
import { ClientInfo } from "@astypes/clientinfo/clientinfo"
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo"
import { NotRequireID } from "@astypes/helperpath/helpertypes"
import { PositiveInteger } from "@astypes/positiveinteger"

export interface IBox {
    search: (info:  Partial<BoxInfo>, 
                                    initiator: AdminInfo | ClientInfo | MechanicInfo,
                                    pass?: number, count?: number) =>Promise<BoxInfo []>;

    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<BoxInfo[]>;
}