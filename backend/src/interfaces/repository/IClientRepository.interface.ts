import { ClientInfo } from "../../types/clientinfo/clientinfo";
import { NotRequireID } from "../../types/helperpath/helpertypes";
export interface IClientRepository {
    create: (info: NotRequireID<ClientInfo>) => Promise<undefined>;
    update: (info: ClientInfo) => Promise<undefined>;
    search: (info: Partial<ClientInfo>, pass?: number, count?: number) 
                                                            => Promise<ClientInfo []>;
    getListOfAll: (pass?: number, count?: number) => Promise<ClientInfo[]>;
    validateEmailExisting: (info: string) => Promise<boolean>;
    validatePhoneExisting: (info: string) => Promise<boolean>;
};