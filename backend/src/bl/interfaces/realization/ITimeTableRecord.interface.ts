import { TimeTableRecordInfo, TimeTableRecordList } from "@bltypes/timetablerecordinfo/timetablerecordinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface ITimeTableRecord {
    search: (info:  NotRequireID<TimeTableRecordList>, 
        initiator: AdminInfo | MechanicInfo,
        pass?: number, count?: number) => Promise<TimeTableRecordList []>
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<TimeTableRecordList[]>;
}