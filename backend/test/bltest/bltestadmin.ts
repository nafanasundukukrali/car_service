import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { injectable } from "tsyringe";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { Id } from "@astypes/id/id";
import { UserRoles } from "@astypes/userinfo/userinfo";

@injectable()
export class BLTestAdminCreateCorrectWork implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        if (info.id !== undefined)
        {
            let buf: Id = new Id('1');
            let clientIn: AdminInfo = {id: buf, type: UserRoles.admin};
            return [clientIn];
        }

        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestAdminNoUser implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

export class BLTestAdminCreateExistingEmail implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        if (info.id !== undefined)
        {
            let buf: Id = new Id('1');
            let clientIn: AdminInfo = {id: buf, type: UserRoles.admin};
            return [clientIn];
        }

        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return true;
    }
}

@injectable()
export class BLTestAdminUpdateInfoUser implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        let buf1: Id = new Id('1');
        if (info.id !== undefined && buf1.isEqual(info.id))
        {
            let buf: Id = new Id('1');
            let clientIn: AdminInfo = {id: buf, type: UserRoles.admin};
            return [clientIn];
        }

        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestAdminNotExists implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        return [];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}


@injectable()
export class BLTestAdminCreateUserExist implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        let buf: Id = new Id('2w2w');
        let clientIn: AdminInfo = {id: buf, type: UserRoles.admin};
        return [clientIn];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestAdminNotCreateCorrectWork implements IAdminRepository {
    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: AdminInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []>
    {
        let buf: Id = new Id('2w2w');
        let res: AdminInfo = {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"};
        return [res];
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        let res: AdminInfo[] = [{"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
                                {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf2, "password" : "ddqq"},
                                {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf3, "password" : "ddqq"}]
        return res;
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}
