import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { VocationInfo } from '@bltypes/vocationinfo/vocationinfo';
import { AdminInfo } from '@bltypes/admininfo/admininfo';
import { MechanicInfo } from '@bltypes/mechanicinfo/mechanicinfo';
import { PositiveInteger } from "@bltypes/positiveinteger"

export interface IVocation {
    planeVocation: (info: NotRequireID<Required<VocationInfo>>, 
        initiator: AdminInfo, today: Date) => Promise<undefined>;
    dropVocation: (info: Required<VocationInfo>, 
            initiator: AdminInfo, today: Date) => Promise<undefined>;
    search: (info: Partial<VocationInfo>, initiator: AdminInfo | MechanicInfo, pass?: number, count?: number) => Promise<VocationInfo []>
    getListOfAll: (initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger) => Promise<VocationInfo[]>;
    validateTodayVocation: (today: Date) => Promise<undefined>;
}