import { BaseStatus } from "../basestatus/basestatus";
import { Id } from "../id/id";

export enum ApplicationStatusType {
    created = 'created',
    dirty = 'dirty',
    closed = 'closed'
}

export type ApplicationStatus = BaseStatus | ApplicationStatusType;

export function get_application_status_id(status: ApplicationStatus | undefined)
{
    if (status)
        if (status == ApplicationStatusType.created)
            return 0
        else if (status == BaseStatus.stored)
            return 1
        else if (status == ApplicationStatusType.dirty)
            return 2
        else 
            return 3
}

export function get_status_by_id(status: Id)
{
    if (status)
        if (status.getStringVersion() === '3')
            return ApplicationStatusType.closed
        else if (status.getStringVersion() === '2')
            return ApplicationStatusType.dirty
        else if (status.getStringVersion() === '0')
            return ApplicationStatusType.created
        else 
            return BaseStatus.stored
}

export async function setDirtyStatus<T extends {status?: ApplicationStatus}> (input: T): Promise<undefined> {
    input.status = ApplicationStatusType.dirty;
};

export async function setSavedStatus<T extends {status?: ApplicationStatus}> (input: T): Promise<undefined> {
    input.status = BaseStatus.stored;
};

export async function setClosedStatus<T extends {status?: ApplicationStatus}> (input: T): Promise<undefined> {
    input.status = ApplicationStatusType.closed;
};

export async function setCreatedStatus<T extends {status?: ApplicationStatus}> (input: T): Promise<undefined> {
    input.status = ApplicationStatusType.created;
};

export async function isDirty<T extends {status?: ApplicationStatus}> (input: T): Promise<boolean>
{
    return input.status && input.status === ApplicationStatusType.dirty;
}

export async function isClosed<T extends {status?: ApplicationStatus}> (input: T): Promise<boolean>
{
    return input.status && input.status === ApplicationStatusType.closed;
}

export async function isCreated<T extends {status?: ApplicationStatus}> (input: T): Promise<boolean>
{
    return input.status && input.status === ApplicationStatusType.created;
}

export async function isSaved<T extends {status?: ApplicationStatus}> (input: T): Promise<boolean>
{
    return input.status  === ApplicationStatusType.dirty;
}