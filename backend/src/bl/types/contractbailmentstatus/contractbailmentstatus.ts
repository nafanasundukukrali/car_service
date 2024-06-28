import { BaseStatus } from "../basestatus/basestatus";

export enum ContractBailmentStatusType {
    expired = 'expired',
    dirty = 'dirty'
}

export type ContractBailmentStatus = BaseStatus | ContractBailmentStatusType;