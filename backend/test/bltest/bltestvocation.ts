import { injectable } from "tsyringe";
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { Id } from '@astypes/id/id';
import { VocationInfo } from "@astypes/vocationinfo/vocationinfo";
import { IVocationRepository } from "@asinterfaces/repository/IVocationRepository.interface";
import { assert, expect } from "chai";
import { UserRoles } from "@astypes/userinfo/userinfo";

@injectable()
export class BLTestVocationCreateCorrectWork implements IVocationRepository {
    async create (info: NotRequireID<VocationInfo>): Promise<undefined>
    {
        let buf: Id = new Id('1');
        let startDate = new Date();
        startDate.setUTCFullYear(2024);
        startDate.setUTCMonth(6);
        startDate.setUTCDate(2);
        startDate.setUTCMilliseconds(0);
        let endDate = new Date();
        endDate.setUTCFullYear(2024);
        endDate.setUTCMonth(6);
        endDate.setUTCDate(9);
        endDate.setUTCMilliseconds(0);
        let res: VocationInfo = {who: buf, startDate: startDate, endDate: endDate, id: buf};
        expect(info).is.deep.equal(res);
    }

    async drop (info: VocationInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<VocationInfo>, pass?: number, count?: number): Promise<VocationInfo[]>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<VocationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestVocationCreateUserExists implements IVocationRepository {
    async create (info: NotRequireID<VocationInfo>): Promise<undefined>
    {
        return;
    }

    async drop (info: VocationInfo): Promise<undefined>
    {
        let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);

      expect({who: buf, startDate: startDate, endDate: endDate, id: buf}).is.deep.equal(info);
    }

    async search (info: Partial<VocationInfo>, pass?: number, count?: number): Promise<VocationInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate = new Date();
        startDate.setUTCFullYear(2024);
        startDate.setUTCMonth(12);
        startDate.setUTCDate(2);
        let endDate = new Date();
        endDate.setUTCFullYear(2025);
        endDate.setUTCMonth(12);
        endDate.setUTCDate(2);
        const clientIn: VocationInfo = {who: buf1, startDate: startDate, endDate: endDate, id: buf1};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<VocationInfo[]>
    {
        if (pass && count && (pass !== 1 || count !== 2))
            assert.fail("pass and count not throwed!");

        let buf1: Id = new Id("3");
        let startDate = new Date();
        startDate.setUTCFullYear(2024);
        startDate.setUTCMonth(12);
        startDate.setUTCDate(2);
        let endDate = new Date();
        endDate.setUTCFullYear(2025);
        endDate.setUTCMonth(12);
        endDate.setUTCDate(2);
        const clientIn: VocationInfo = {who: buf1, startDate: startDate, endDate: endDate, id: buf1};
        return [clientIn];
    }
}

@injectable()
export class BLTestVocationSearchPeriods implements IVocationRepository {
    async create (info: NotRequireID<VocationInfo>): Promise<undefined>
    {
        return;
    }

    async drop (info: VocationInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<VocationInfo>, pass?: number, count?: number): Promise<VocationInfo[]>
    {
        let buf1: Id = new Id("3");
        let startDate = new Date();
        startDate.setUTCFullYear(2024);
        startDate.setUTCMonth(1);
        startDate.setUTCDate(2);
        let endDate = new Date();
        endDate.setUTCFullYear(2025);
        endDate.setUTCMonth(12);
        endDate.setUTCDate(2);
        const clientIn: VocationInfo = {who: buf1, startDate: startDate, endDate: endDate, id: buf1};

        let buf2: Id = new Id("3");
        let startDate2 = new Date();
        startDate2.setUTCFullYear(2029);
        startDate2.setUTCMonth(1);
        startDate2.setUTCDate(2);
        let endDate2 = new Date();
        endDate2.setUTCFullYear(2030);
        endDate2.setUTCMonth(12);
        endDate2.setUTCDate(2);
        const clientIn2: VocationInfo = {who: buf1, startDate: startDate, endDate: endDate, id: buf1};

        return [clientIn2, clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<VocationInfo[]>
    {
        return [];
    }
}

@injectable()
export class BLTestNightVocationUpdateTest implements IVocationRepository {
    async create (info: NotRequireID<VocationInfo>): Promise<undefined>
    {
        return;
    }

    async drop (info: VocationInfo): Promise<undefined>
    {
        return undefined;
    }

    async search (info: Partial<VocationInfo>, pass?: number, count?: number): Promise<VocationInfo[]>
    {
        if (info.startDate)
            return [{id: new Id("1"), who: new Id("1")}, {id: new Id("1"), who: new Id("2")}];
        else
            return [{id: new Id("1"), who: new Id("3")}, {id: new Id("1"), who: new Id("4")}];
    }

    async getListOfAll(pass?: number, count?: number): Promise<VocationInfo[]>
    {
        return [];
    }
}