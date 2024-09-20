import { IApplicationRepository } from "@asinterfaces/repository/IApplicationRepository.interface";
import { injectable } from "tsyringe";
import { ApplicationInfo } from '@astypes/applicationinfo/applicationinfo';
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { Id } from "@astypes/id/id";
import { assert, expect } from "chai";
import { ApplicationStatusType } from "@astypes/applicationstatus/applicationstatus";

@injectable()
export class BLTestApplicationNormal implements IApplicationRepository {
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async dropByOneTransaction (info: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ApplicationInfo>, 
                    pass?: number, count?: number): 
        Promise<ApplicationInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestApplicationVocationAllToDirty implements IApplicationRepository {
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async dropByOneTransaction (info: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined>
    {
        if (infoArr.length !== 2)
            assert.fail("Array not has required length");

        for (let i = 0; i < 2; i++)
            if ((!infoArr[i].id.isEqual(new Id("5")) || 
                infoArr[i].car !== 'dwdwd' || infoArr[i].mechanicComment !== 'Pony' || infoArr[i].status !== ApplicationStatusType.dirty) || !infoArr[i].client.isEqual(new Id('3')))
                assert.fail("Array not dirty satus");

        assert.isOk(true, 'test passed');
        return;
    }

    async search (info: Partial<ApplicationInfo>, 
                    pass?: number, count?: number): 
        Promise<ApplicationInfo []>
    {
        let app1: ApplicationInfo = {id: new Id("5"), car: 'dwdwd', mechanicComment: "Pony", timeRecord: info.timeRecord, status: BaseStatus.stored, client: new Id('3')};
        return [app1];
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestApplicationVocationNotAllDirty implements IApplicationRepository {
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async dropByOneTransaction (info: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined>
    {
        if (infoArr.length !== 0)
            assert.fail("Array not has required length");

        assert.isOk(true, 'test passed');
        return;
    }

    async search (info: Partial<ApplicationInfo>, 
                    pass?: number, count?: number): 
        Promise<ApplicationInfo []>
    {
        let app1: ApplicationInfo = {id: new Id("5"), car: 'dwdwd', mechanicComment: "Pony", timeRecord: info.timeRecord, status: ApplicationStatusType.closed, client: new Id('3')};
        return [app1];
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestApplicationSheduleTest implements IApplicationRepository {
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async dropByOneTransaction (info: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined>
    {
        assert.isOk(infoArr.length === 1 && infoArr[0].status === ApplicationStatusType.dirty);
        return;
    }

    async search (info: Partial<ApplicationInfo>, 
                    pass?: number, count?: number): 
        Promise<ApplicationInfo []>
    {
        let app1: ApplicationInfo = {id: new Id("5"), car: 'dwdwd', mechanicComment: "Pony", timeRecord: info.timeRecord, status: ApplicationStatusType.closed, client: new Id('3')};
        let app2: ApplicationInfo = {id: new Id("6"), car: 'dwdwd', mechanicComment: "Pony", timeRecord: info.timeRecord, status: ApplicationStatusType.created, client: new Id('3')};
        let app3: ApplicationInfo = {id: new Id("7"), car: 'dwdwd', mechanicComment: "Pony", timeRecord: info.timeRecord, status: ApplicationStatusType.dirty, client: new Id('3')};
        return [app1, app2, app3];
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestApplicationCheckStatus implements IApplicationRepository {
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined>
    {
        assert.isOk(info.status == ApplicationStatusType.created);
    }

    async update (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: ApplicationInfo): Promise<undefined>
    {
        return;
    }

    async dropByOneTransaction (info: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ApplicationInfo>, 
                    pass?: number, count?: number): 
        Promise<ApplicationInfo []>
    {
        let buf: Id = new Id('1');
        let date = new Date();
        date.setUTCMilliseconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);
        let day: any = (new Date()).getUTCDay() + 1
        let timerec = {id: buf, sheduleRecord: buf, day: day, dateTime: date, duration: 5}

        return [{id: buf, timeRecord: timerec}];
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]>
    {
        return [];
    }
}
