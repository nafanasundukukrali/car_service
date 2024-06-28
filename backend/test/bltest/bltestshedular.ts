import { injectable } from "tsyringe";
import { SheduleRecordInfo } from '@bltypes/shedulerecordinfo/shedulerecordinfo';
import { ISheduleRecordRepository } from '@blinterfaces/repository/ISheduleRecordRepository.interface';
import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { Id } from '@bltypes/id/id';
import { assert } from "chai";
import { isAchived } from "@blrealization/changeachivedstatus/changeachivedstatus";

@injectable()
export class BLTestSheduleRecordCreateCorrectWork implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }


    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordCreateUserExists implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date();
        startDate.setUTCHours(12);
        let endDate: Date = new Date();
        endDate.setUTCHours(18);
        let day: any = startDate.getUTCDay() + 1;
        day = day >= 1 && day < 8 ? day : 1;
        const clientIn: SheduleRecordInfo = {id: buf1, mechanic: buf1, day:day, timeStart: startDate, timeEnd: endDate, box: buf1};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordVocationInfoForMechanic implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }


    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: info.mechanic, day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        return [clientIn1, clientIn2];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordApplicatioCorrectTest implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }


    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate: Date = new Date();
        startDate.setUTCHours(9);
        let endDate: Date = new Date();
        endDate.setUTCHours(14);
        let day: any = startDate.getUTCDay() + 1;
        day = day >= 1 && day < 8 ? day : 1;
        const clientIn: SheduleRecordInfo = {id: buf1, mechanic: buf1, day:day, timeStart: startDate, timeEnd: endDate, box: buf1};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordUpdateNotSameIdSearchResult implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: new Id("1"), day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: new Id("2"), day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        return [clientIn1, clientIn2];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: new Id("1"), day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: new Id("2"), day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        return [clientIn1, clientIn2];
    }
}

@injectable()
export class BLTestSheduleRecordSearchMechanicIdSame implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        if (info.mechanic === undefined)
            assert.fail("no mechanic id in search param");
        
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: info.mechanic, day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        return [clientIn1, clientIn2];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordMehcanicInThisDay implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }


    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        if (info.id !== undefined)
        {   
            let buf1: Id = new Id("3");
            let startDate1: Date = new Date();
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            startDate1.setUTCHours(13);
            let endDate1: Date = new Date(0);
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            endDate1.setUTCHours(15);
            const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
            return [clientIn2];
        }

        if (info.day && info.mechanic && !info.box)
        {
            let buf1: Id = new Id("3");
            let startDate1: Date = new Date();
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            startDate1.setUTCHours(13);
            let endDate1: Date = new Date(0);
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            endDate1.setUTCHours(15);
            const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
            let buf2: Id = new Id("4");
            let startDate2: Date = new Date();
            startDate2.setUTCMilliseconds(0);
            startDate2.setMinutes(0);
            startDate2.setUTCHours(17);
            let endDate2: Date = new Date();
            endDate2.setUTCMilliseconds(0);
            endDate2.setMinutes(0);
            endDate2.setUTCHours(18);
            const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: info.mechanic, day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
            return [clientIn1, clientIn2];
        }

        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordMehcanicInThisDayUpdate implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }
    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        if (info.id)
        {
            let buf1: Id = new Id("3");
            let startDate1: Date = new Date();
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            startDate1.setUTCHours(13);
            let endDate1: Date = new Date(0);
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            endDate1.setUTCHours(15);
            const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
            return [clientIn2];
        }

        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestSheduleRecordBoxInThisDay implements ISheduleRecordRepository {
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: SheduleRecordInfo): Promise<undefined>
    {
        return undefined;
    }


    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        if (info.day && !info.mechanic && info.box)
        {
            let buf1: Id = new Id("3");
            let startDate1: Date = new Date();
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            startDate1.setUTCHours(13);
            let endDate1: Date = new Date(0);
            startDate1.setUTCMilliseconds(0);
            startDate1.setMinutes(0);
            endDate1.setUTCHours(15);
            const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: info.mechanic, day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
            let buf2: Id = new Id("4");
            let startDate2: Date = new Date();
            startDate2.setUTCMilliseconds(0);
            startDate2.setMinutes(0);
            startDate2.setUTCHours(17);
            let endDate2: Date = new Date();
            endDate2.setUTCMilliseconds(0);
            endDate2.setMinutes(0);
            endDate2.setUTCHours(18);
            const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: info.mechanic, day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
            return [clientIn1, clientIn2];
        }

        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<SheduleRecordInfo[]>
    {
        return [];
    }
}