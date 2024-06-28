import { SheduleRecordInfo } from "@bltypes/shedulerecordinfo/shedulerecordinfo"
import { NotRequireID } from "@bltypes/helperpath/helpertypes"
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { MechanicInfo } from '@bltypes/mechanicinfo/mechanicinfo';
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface ISheduleRecord {
    // validate_shedulare: (saving_result: NotRequireID<SheduleRecordInfo>) => Promise<undefined>;
    create: (info: NotRequireID<SheduleRecordInfo>, initiator: AdminInfo) => Promise<undefined>;
    update: (info: SheduleRecordInfo, initiator: AdminInfo) => Promise<undefined>;
    archive: (info: SheduleRecordInfo, initiator: AdminInfo) => Promise<undefined>;
    search: (info: Partial<SheduleRecordInfo>, initiator: AdminInfo | MechanicInfo,
        pass?: number, count?: number) => Promise<SheduleRecordInfo []>;
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) =>  Promise<SheduleRecordInfo[]>;
}