import { ICarRepository } from "@//bl/interfaces/repository/ICarRepository.interface";
import { injectable } from "tsyringe";
import { CarInfo } from "@bltypes/carinfo/carinfo";
import { Id } from "@bltypes/id/id";

@injectable()
export class BLTestCarCreateCorrectWork implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return false;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async update (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}

@injectable()
export class BLTestCarCreateErrorInRepository implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return false;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        throw Error("error in create");
    }

    async update (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}

@injectable()
export class BLTestCarExistsCorrect implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return true;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async update (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [{'VIN': 'lol'}];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}

@injectable()
export class BLTestCarApplicationInccorect implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return true;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async update (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [{'VIN': 'lol', owner: new Id("333")}];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}

@injectable()
export class BLTestCarApplicationCcorect implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return true;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async update (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [{'VIN': 'lol', owner: new Id("1")}];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}

@injectable()
export class BLTestCarErrorNotCreate implements ICarRepository {
    async checkExists(info: CarInfo):  Promise<boolean> {
        return true;
    }

    async create (info: CarInfo): Promise<undefined>
    {
        return;
    }

    async update (info: CarInfo): Promise<undefined>
    {
        throw Error("error in update");
    }

    async drop (info: CarInfo): Promise<undefined>
    {
        throw Error("error in drop");
    }

    async search (info: Omit<CarInfo, 'VIN'> & Partial<Pick<CarInfo, 'VIN'>>, pass?: number, count?: number): Promise<undefined | CarInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]>
    {
        return [{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}];
    }
}
