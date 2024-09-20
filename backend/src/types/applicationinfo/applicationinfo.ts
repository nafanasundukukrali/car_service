import { ApplicationStatus } from '../applicationstatus/applicationstatus';
import { Id } from '../id/id';
import { TimeTableRecordInfo } from '../timetablerecordinfo/timetablerecordinfo';

export type ApplicationInfo = {
    id: Id,
    car?: string,
    mechanicComment?: string,
    timeRecord?: TimeTableRecordInfo,
    service?: Id,
    status?: ApplicationStatus,
    client?: Id
}