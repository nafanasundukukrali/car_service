import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { PositiveInteger } from "@bltypes/positiveinteger";

export interface IAdmin {
    create: (info: NotRequireID<AdminInfo>, initiator: AdminInfo) => Promise<undefined>;
    update: (info: AdminInfo, initiator: AdminInfo) => Promise <undefined>;
    search: (info:  Partial<AdminInfo>, initiator: AdminInfo, pass?: number, count?: number) => Promise<AdminInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<AdminInfo[]>;
}