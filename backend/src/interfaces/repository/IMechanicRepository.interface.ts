import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { NotRequireID } from "../../types/helperpath/helpertypes";

export interface IMechanicRepository {
    create: (info: NotRequireID<MechanicInfo>) => Promise<undefined>;
    search: (info: Partial<MechanicInfo>, pass?: number, count?: number) => Promise<MechanicInfo[]>;
    update: (info: MechanicInfo) => Promise<undefined>;
    updateByOneTransaction: (infoArr: MechanicInfo[]) => Promise<undefined>;
    getListOfAll: (pass?: number, count?: number) => Promise<MechanicInfo[]>;
    validateEmailExisting (email: string): Promise<boolean>
}