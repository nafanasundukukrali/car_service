import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { AdminRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { DAInjectionReg } from '@da/dainjection';
import { IAdminRepository } from '@asinterfaces/repository/IAdminRepository.interface';
import { UserRoles } from '@astypes/userinfo/userinfo';

new DAInjectionReg();
const admin: IAdminRepository = container.resolve(AdminRepositoryName);

describe('admin repository', () => {
    it('create', async () => {
        let date: Date = new Date();
        date.setUTCFullYear(2000);

        await admin.create({fio: "Hello user",
                    email: "hahahadmin@yandex.ru",
                    password: "123",
                    type: UserRoles.admin
                });

        let res = await admin.search({email: "hahahadmin@yandex.ru"});
    
        assert.isNotOk(res.length !== 1 || res[0].email !== "hahahadmin@yandex.ru");
    });

    it('existing email', async () => {
        let res = await admin.validateEmailExisting("hahahadmin@yandex.ru");
    
        assert.isOk(res);
    });

    it('update', async () => {
        await admin.create({fio: "Hello user",
                    email: "hahahadmin33@yandex.ru",
                    password: "123",
                    type: UserRoles.admin
                });
        let res1 = await admin.search({email: "hahahadmin33@yandex.ru"});
        await admin.update({id: res1[0].id, email:  "hahahadmin33@mail.ru", type: UserRoles.admin})
        res1 = await admin.search({id: res1[0].id});
        assert.isNotOk(res1.length !== 1 || res1[0].email !== "hahahadmin33@mail.ru");
    });

    it('validate get list of all', async () => {
        let res = await admin.getListOfAll(0, 10);
    
        assert.isOk(res.length == 10);
    });
});