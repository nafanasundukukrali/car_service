import { TimeTableRecordInfo } from '@bltypes/timetablerecordinfo/timetablerecordinfo';
import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { Id } from '@bltypes/id/id';
import { TimeTableRecordList } from '../../types/timetablerecordinfo/timetablerecordinfo';
export interface ITimeTableRecordRepository {
    update: (info: TimeTableRecordInfo) => Promise<undefined>;
    searchList: (info: Partial<TimeTableRecordList>, who?: Id, pass?: number, count?: number) => Promise<TimeTableRecordList[]>;
    search: (info: Partial<TimeTableRecordInfo>, who?: Id, pass?: number, count?: number) => Promise<TimeTableRecordInfo []>,
    searchDatePeriod: (info: Partial<TimeTableRecordInfo>, startDate: Date, endDate: Date) => Promise<TimeTableRecordInfo []>,
    getListOfAll: (pass?: number, count?: number) => Promise<TimeTableRecordList []>
}