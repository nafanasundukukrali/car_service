import { BaseStatus } from "@bltypes/basestatus/basestatus";

export enum ApplicationStatusType {
    created = 'created',
    dirty = 'dirty',
    closed = 'closed'
}

export type ApplicationStatus = BaseStatus | ApplicationStatusType;