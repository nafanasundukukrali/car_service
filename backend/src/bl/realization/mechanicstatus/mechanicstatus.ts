import { MechanicStatus } from '@astypes/mechanicstatus/mechanicstatus';
import { MechanicStatusType } from '@astypes/mechanicstatus/mechanicstatus';

export async function setVocation<T extends {status?: MechanicStatus}> (input: T): Promise<undefined> {
    input.status = MechanicStatusType.inVocation;
};

export async function  isInVocation<T extends {status?: MechanicStatus}>(input: T): Promise<boolean> {
    return input.status && input.status === MechanicStatusType.inVocation; 
};
