import { VocationInfo } from "@bltypes/vocationinfo/vocationinfo";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";

export interface IVocationRepository {
    create: (info: NotRequireID<Required<VocationInfo>>) => Promise<undefined>;
    search: (info: Partial<VocationInfo>, pass?: number, count?: number) => Promise<VocationInfo[]>;
    drop: (info: VocationInfo) => Promise<undefined>;
    getListOfAll: (pass?: number, count?: number) => Promise<VocationInfo[]>;
}