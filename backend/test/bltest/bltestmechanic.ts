import { IMechanicRepository } from '@//bl/interfaces/repository/IMechanicRepository.interface';
import { injectable } from "tsyringe";
import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { Id } from '@bltypes/id/id';
import { MechanicInfo } from '@bltypes/mechanicinfo/mechanicinfo';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { MechanicStatusType } from '@bltypes/mechanicstatus/mechanicstatus';
import { BaseStatus } from '@bltypes/basestatus/basestatus';
import { assert, expect } from 'chai';

@injectable()
export class BLTestMechanicCreateCorrectWork implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return undefined;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

export class BLTestMechanicCreateExistingEmail implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return undefined;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return true;
    }
}

@injectable()
export class BLTestMechanicCreateUserExists implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return undefined;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
        return;
    }

    async search (info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        let buf1: Id = new Id("3");
        const clientIn: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"};
        return [clientIn];
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        return [];
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestMechanicListNotUndefValidCorrectWork implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
        return;
    }

    async search(info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo []>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        // if (info.id !== undefined)
        // {
        //     const clientIn: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"};
        //     return [clientIn];
        // }

        const clients: MechanicInfo[] = [
            {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
            {"type": UserRoles.mechanic, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq"},
            {"type": UserRoles.mechanic, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq"},
        ];

        return clients;
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        const clients: MechanicInfo[] = [
            {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
            {"type": UserRoles.mechanic, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq"},
            {"type": UserRoles.mechanic, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq"},
        ];

        return clients;
    }

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestMechanicVocationTest implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
        if (this.validated_voc)
        {
            expect(infoArr).is.deep.equal(
                [
                    {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("1"), "password" : "ddqq", status: MechanicStatusType.inVocation},
                    {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("2"), "password" : "ddqq", status: MechanicStatusType.inVocation}
                ]
            );
            this.validated_voc = 0;
        }
        else 
        {
            expect(infoArr).is.deep.equal(
                [
                    {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("3"), "password" : "ddqq", status: BaseStatus.stored},
                    {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("4"), "password" : "ddqq", status: BaseStatus.stored}
                ]
            );
        }
    }

    async search(info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo []>
    {
        if (info.id.isEqual(new Id("1")))
            return [{"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("1"), "password" : "ddqq", status: BaseStatus.stored}];
        else if (info.id.isEqual(new Id("2")))
            return [{"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("2"), "password" : "ddqq", status: BaseStatus.stored}];
        else if (info.id.isEqual(new Id("3")))
            return [{"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("3"), "password" : "ddqq", status: MechanicStatusType.inVocation}];
        else if (info.id.isEqual(new Id("4")))
            return [{"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": new Id("4"), "password" : "ddqq", status: MechanicStatusType.inVocation}];
        
        assert.fail("no correct info id");
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        const clients: MechanicInfo[] = [
            {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
            {"type": UserRoles.mechanic, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq"},
            {"type": UserRoles.mechanic, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq"},
        ];

        return clients;
    }

    private validated_voc = 1;

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}

@injectable()
export class BLTestShedularTestUsersInDay implements IMechanicRepository {
    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        return;
    }

    async update (info: MechanicInfo): Promise<undefined>
    {
        return;
    }

    async updateByOneTransaction (infoArr: MechanicInfo[]): Promise<undefined>
    {
    }

    async search(info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo []>
    {
        const date = new Date();
        return [];
    }

    async getListOfAll(pass?: number, count?: number): Promise<MechanicInfo[]>
    {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

        const clients: MechanicInfo[] = [
            {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
            {"type": UserRoles.mechanic, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq"},
            {"type": UserRoles.mechanic, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq"},
        ];

        return clients;
    }

    private validated_voc = 1;

    async validateEmailExisting(email: String): Promise<boolean>
    {
        return false;
    }
}