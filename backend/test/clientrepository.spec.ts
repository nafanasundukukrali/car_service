import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { ClientRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { DAInjectionReg } from '@da/dainjection';
import { IClientRepository } from '@blinterfaces/repository/IClientRepository.interface';
import { UserRoles } from '@bltypes/userinfo/userinfo';

new DAInjectionReg();
const client: IClientRepository = container.resolve(ClientRepositoryName);

describe('client repository', () => {
    it('create', async () => {
        let date: Date = new Date();
        date.setUTCFullYear(2000);

        await client.create({fio: "Hello user",
                    email: "hahahemailwhatisemail@yandex.ru",
                    password: "123",
                    phone: "+792673",
                    dateBIrth: date,
                    type: UserRoles.client
                });

        let res = await client.search({email: "hahahemailwhatisemail@yandex.ru"});
    
        assert.isNotOk(res.length !== 1 || res[0].email !== "hahahemailwhatisemail@yandex.ru");
    });

    it('existing email', async () => {
        let res = await client.validateEmailExisting("hahahemailwhatisemail@yandex.ru");
    
        assert.isOk(res);
    });

    it('update', async () => {
        let res1 = await client.search({email: "hahahemailwhatisemail@yandex.ru"});
        await client.update({id: res1[0].id, email:  "hahahemailwhatisemail@mail.ru", type: UserRoles.client})
        res1 = await client.search({id: res1[0].id});
        assert.isNotOk(res1.length !== 1 || res1[0].email !== "hahahemailwhatisemail@mail.ru");
    });

    it('validate phone existing', async () => {
        let res = await client.validatePhoneExisting("+792673");
    
        assert.isOk(res);
    });

    it('validate get list of all', async () => {
        let res = await client.getListOfAll(0, 10);
    
        assert.isOk(res.length == 10);
    });
});