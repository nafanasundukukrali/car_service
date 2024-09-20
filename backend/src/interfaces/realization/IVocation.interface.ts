import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { VocationInfo } from '@astypes/vocationinfo/vocationinfo';
import { AdminInfo } from '@astypes/admininfo/admininfo';
import { MechanicInfo } from '@astypes/mechanicinfo/mechanicinfo';
import { PositiveInteger } from "@astypes/positiveinteger"

export interface IVocation {
    planeVocation: (info: NotRequireID<Required<VocationInfo>>, 
        initiator: AdminInfo, today: Date) => Promise<undefined>;
    dropVocation: (info: Required<VocationInfo>, 
            initiator: AdminInfo, today: Date) => Promise<undefined>;
    search: (info: Partial<VocationInfo>, initiator: AdminInfo | MechanicInfo, pass?: number, count?: number) => Promise<VocationInfo []>
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<VocationInfo[]>;
    validateTodayVocation: (today: Date) => Promise<undefined>;
}