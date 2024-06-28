import { ServiceInfo } from "@bltypes/serviceinfo/serviceinfo";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";

export interface IServiceRepository {
    search: (info:  Partial<ServiceInfo>,
                pass?: number, count?:number) => Promise<ServiceInfo[]>;
    getListOfAll: (pass?: number, count?:number) => Promise<ServiceInfo[]>;
}