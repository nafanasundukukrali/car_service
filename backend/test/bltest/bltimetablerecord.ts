import { injectable } from "tsyringe";
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { Id } from '@astypes/id/id';
import { TimeTableRecordInfo, TimeTableRecordList } from '@astypes/timetablerecordinfo/timetablerecordinfo';
import { ITimeTableRecordRepository } from '@asinterfaces/repository/ITimeTableRecordRepository.interface';
import { ServiceInfo } from '@astypes/serviceinfo/serviceinfo';

@injectable()
export class BLTestTimeTableRecordCreateCorrectWork implements ITimeTableRecordRepository {
    async update (info: TimeTableRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async searchList (info: Partial<TimeTableRecordList>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        return [];
    }

    async search (info: Partial<TimeTableRecordInfo>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordInfo[]>
    {
        return [];
    }

    async searchDatePeriod (info: Partial<TimeTableRecordInfo>, startDate: Date, endDate: Date): Promise<TimeTableRecordInfo[]>
    {
        return [];
    }


    async getListOfAll(pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        return [];
    }
}

@injectable()
export class BLTestTimeTableRecordCreateUserExists implements ITimeTableRecordRepository {

    async update (info: TimeTableRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async searchList (info: Partial<TimeTableRecordList>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(12);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordList = {id: buf1, dateTime: date};
        return [clientIn];
    }

    async search (info: Partial<TimeTableRecordInfo>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(12);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordInfo = {id: buf1, sheduleRecord: buf1, dateTime: startDate};
        return [clientIn];
    }

    async searchDatePeriod (info: Partial<TimeTableRecordInfo>, startDate: Date, endDate: Date): Promise<TimeTableRecordInfo[]>
    {
        return [];
    }


    async getListOfAll(pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        return [];
    }
}


@injectable()
export class BLTestTimeTableRecordVocationReturnTImeRecords implements ITimeTableRecordRepository {

    async update (info: TimeTableRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async searchList (info: Partial<TimeTableRecordList>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(13);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordList = {id: buf1, dateTime: date};
        return [clientIn];
    }

    async search (info: Partial<TimeTableRecordInfo>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(13);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);
        date.setUTCHours(13);

        const clientIn: TimeTableRecordInfo = {id: buf1, sheduleRecord: buf1, dateTime: date};
        return [clientIn];
    }

    async searchDatePeriod (info: Partial<TimeTableRecordInfo>, startDate: Date, endDate: Date): Promise<TimeTableRecordInfo[]>
    {
        let buf1: Id = new Id("3");

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);

        const clientIn: TimeTableRecordInfo = {id: buf1, sheduleRecord: buf1, dateTime: date};
        return [clientIn];
    }


    async getListOfAll(pass?: number, count?: number): Promise<TimeTableRecordList[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(12);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordList = {id: buf1, dateTime: date};
        return [clientIn];
    }
}
