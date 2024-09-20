import { AdminInfo } from "@astypes/admininfo/admininfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";

export interface IAdminRepository {
    create: (info: NotRequireID<AdminInfo>) => Promise<undefined>;
    update: (info: AdminInfo) => Promise<undefined>;
    search: (info: Partial<AdminInfo>, pass?: number, count?: number) 
                                                            => Promise<AdminInfo []>;
    getListOfAll: (pass?: number, count?: number) => Promise<AdminInfo[]>;
    validateEmailExisting: (email: string) => Promise<boolean> 
};
