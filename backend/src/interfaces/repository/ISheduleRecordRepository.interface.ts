import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
export interface ISheduleRecordRepository {
    create: (info: NotRequireID<SheduleRecordInfo>) => Promise<undefined>;
    search: (info:  Partial<SheduleRecordInfo>,
                pass?: number, count?:number) => Promise<SheduleRecordInfo[]>;
    update: (info: SheduleRecordInfo) => Promise<undefined>;
    getListOfAll: (pass?: number, count?:number) => Promise<SheduleRecordInfo[]>;
}