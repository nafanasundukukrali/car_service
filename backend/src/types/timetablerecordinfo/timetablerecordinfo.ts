import { SheduleRecordInfo } from "../shedulerecordinfo/shedulerecordinfo"
import { Id } from "../id/id";
import { ApplicationInfo } from "../applicationinfo/applicationinfo";
import { ClientInfo } from "../clientinfo/clientinfo";
import { CarInfo } from "../carinfo/carinfo";

export type TimeTableRecordList = {
    id: Id,
    application?: ApplicationInfo,
    client?: ClientInfo,
    dateTime?: Date,
    duration?: number
}

export type TimeTableRecordInfo = {
    sheduleRecord?: Id, 
    dateTime?: Date,
    id: Id,
    duration?: number
}