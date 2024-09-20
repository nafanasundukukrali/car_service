import { TimeTableRecordInfo, TimeTableRecordList } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { PositiveInteger } from "@astypes/positiveinteger"

export interface ITimeTableRecord {
    search: (info:  NotRequireID<TimeTableRecordList>, 
        initiator: AdminInfo | MechanicInfo,
        pass?: number, count?: number) => Promise<TimeTableRecordList []>
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<TimeTableRecordList[]>;
}