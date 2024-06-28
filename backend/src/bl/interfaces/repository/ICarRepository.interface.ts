import { CarInfo } from "@bltypes/carinfo/carinfo";

export interface ICarRepository {
    create: (info: Required<CarInfo>) => Promise<undefined>;
    update: (info: CarInfo) => Promise<undefined>;
    drop: (info: CarInfo) => Promise<undefined>
    search: (info: Partial<CarInfo>, pass?: number, count?: number) 
                                                           => Promise<CarInfo []>;
    getListOfAll: (pass?: number, count?: number) => Promise<CarInfo[]>
};