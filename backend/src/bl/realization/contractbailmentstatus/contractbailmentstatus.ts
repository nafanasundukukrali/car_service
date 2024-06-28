import { ContractBailmentStatus, ContractBailmentStatusType } from '@bltypes/contractbailmentstatus/contractbailmentstatus';
import { BaseStatus } from '@bltypes/basestatus/basestatus';

export async function setExiredStatus<T extends {status?: ContractBailmentStatus}>(input: T): Promise<undefined> 
{
    input.status = ContractBailmentStatusType.expired;
};

export async function setSavedStatus<T extends {status?: ContractBailmentStatus}>(input: T): Promise<undefined> 
{
    input.status = BaseStatus.stored;
};

export async function setDirtyStatus<T extends {status?: ContractBailmentStatus}>(input: T): Promise<undefined> 
{
    input.status = ContractBailmentStatusType.dirty;
};

export async function isExipired<T extends {status?: ContractBailmentStatus}>(input: T): Promise<boolean>
{
    return input.status && input.status === ContractBailmentStatusType.expired;
}

export async function isDirty<T extends {status?: ContractBailmentStatus}>(input: T): Promise<boolean>
{
    return input.status && input.status === ContractBailmentStatusType.dirty;
}