import { BoxInfo } from "@astypes/boxinfo/boxinfo";

export interface IBoxRepository {
    search: (info:  Partial<BoxInfo>,
                pass?: number, count?:number) => Promise<BoxInfo[]>;
    getListOfAll: (pass?: number, count?:number) => Promise<BoxInfo[]>;
}