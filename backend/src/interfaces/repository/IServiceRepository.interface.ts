import { ServiceInfo } from "@astypes/serviceinfo/serviceinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";

export interface IServiceRepository {
    search: (info:  Partial<ServiceInfo>,
                pass?: number, count?:number) => Promise<ServiceInfo[]>;
    getListOfAll: (pass?: number, count?:number) => Promise<ServiceInfo[]>;
}