import { CarInfo } from "@astypes/carinfo/carinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { PositiveInteger } from "@astypes/positiveinteger"

export interface ICar {
    create: (info: Required<CarInfo>, initiator: AdminInfo | ClientInfo) => Promise<undefined>;
    update: (info: CarInfo, initiator: AdminInfo | ClientInfo) => Promise<undefined>;
    drop: (info: CarInfo, initiator: AdminInfo) => Promise<undefined>;
    search: (info:  Partial<CarInfo>, 
        initiator: AdminInfo | ClientInfo,
        pass?: number, count?: number) => Promise<CarInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<CarInfo[]>;
}