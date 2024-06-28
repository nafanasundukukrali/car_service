import { IBoxRepository } from "@blinterfaces/repository/IBoxRepository,interface";
import { injectable } from "tsyringe";
import { BoxInfo } from "@bltypes/boxinfo/boxinfo";
import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { Id } from "@bltypes/id/id";
import { UserRoles } from "@bltypes/userinfo/userinfo";

@injectable()
export class BLTestBoxCorrect implements IBoxRepository {

    async search (info: Partial<BoxInfo>, pass?: number, count?: number): Promise<BoxInfo []>
    {
        const id_1 = new Id('1');
        return [{id: id_1, number: 1}];
    }

    async getListOfAll (pass?: number, count?: number): Promise<BoxInfo[]>
    {
        let id_1 = new Id('1');
        let id_2 = new Id('2');
        return [{id: id_1, number: 1}, {id: id_2, number: 2}];
    }
}

@injectable()
export class BLTestBoxEmpty implements IBoxRepository {

    async search (info: Partial<BoxInfo>, pass?: number, count?: number): Promise<BoxInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<BoxInfo[]>
    {
        return [];
    }
}