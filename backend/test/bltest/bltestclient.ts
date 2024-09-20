import { IClientRepository } from '@asinterfaces/repository/IClientRepository.interface';
import { injectable } from "tsyringe";
import { ClientInfo } from '@astypes/clientinfo/clientinfo';
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { Id } from '@astypes/id/id';
import { UserRoles } from '@astypes/userinfo/userinfo';

@injectable()
export class BLTestClientCreateCorrectWork implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestClientCreateExistingEmail implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return true;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestClientCreateExistingPhone implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return true;
    }
}

@injectable()
export class BLTestClientCreateErrorUserExist implements IClientRepository {
    async create (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        let buf: Id = new Id('2w2w');
        let clientIn: ClientInfo = {id: buf, type: UserRoles.client};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestClientErrorCreateRealization implements IClientRepository {
    async create (info: ClientInfo): Promise<undefined>
    {
        throw Error("some");
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}


@injectable()
export class BLTestClientUpdateCorrectWork implements IClientRepository {
    async create (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        let buf: Id = new Id('2w2w');
        let clientIn: ClientInfo = {id: buf, type: UserRoles.client};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestClientErrorNotCreateAndSearchRealization implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        throw Error("some");
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        throw Error("in update rep");
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        let buf: Id = new Id('2w2w');
        let clientIn: ClientInfo = {id: buf, type: UserRoles.client};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        throw Error("error in getlistofall");
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestClientSearchCorrectWork implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        throw Error("some");
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        throw Error("in update rep");
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        let buf1: Id = new Id("1");
        const clientIn: ClientInfo = {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        throw Error("error in getlistofall");
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}


@injectable()
export class BLTestClientListCorrectWork implements IClientRepository {
    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: ClientInfo): Promise<undefined>
    {
        return;
    }

    async search(info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        if (info.id !== undefined)
        {
            const clientIn: ClientInfo = {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"};
            return [clientIn];
        }

        const clients: ClientInfo[] = [
            {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"},
            {"type": UserRoles.client, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq", "phone": "89678974056"},
            {"type": UserRoles.client, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq", "phone": "89679974056"},
        ];

        return clients;
    }

    async getListOfAll(pass?: number, count?: number): Promise<ClientInfo[]>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        const clients: ClientInfo[] = [
            {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"},
            {"type": UserRoles.client, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq", "phone": "89678974056"},
            {"type": UserRoles.client, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq", "phone": "89679974056"},
        ];

        return clients;
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }

    async validatePhoneExisting(email: String): Promise<boolean>
    {
        return false;
    }
}