import { VocationInfo } from "@astypes/vocationinfo/vocationinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";

export interface IVocationRepository {
    create: (info: NotRequireID<Required<VocationInfo>>) => Promise<undefined>;
    search: (info: Partial<VocationInfo>, pass?: number, count?: number) => Promise<VocationInfo[]>;
    drop: (info: VocationInfo) => Promise<undefined>;
    getListOfAll: (pass?: number, count?: number) => Promise<VocationInfo[]>;
}