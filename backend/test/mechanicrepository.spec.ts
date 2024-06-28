import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { DAInjectionReg } from '@da/dainjection';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { MechanicRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { IMechanicRepository } from '@blinterfaces/repository/IMechanicRepository.interface';

new DAInjectionReg();
const mechanic: IMechanicRepository = container.resolve(MechanicRepositoryName);

describe('mechanic repository', () => {
    it('create', async () => {
        let date: Date = new Date();
        date.setUTCFullYear(2000);

        await mechanic.create({fio: "Hello user",
                    email: "hahahamehcanic@yandex.ru",
                    password: "123",
                    type: UserRoles.mechanic
                });

        let res = await mechanic.search({email: "hahahamehcanic@yandex.ru"});
    
        assert.isNotOk(res.length !== 1 || res[0].email !== "hahahamehcanic@yandex.ru");
    });

    it('existing email', async () => {
        let res = await mechanic.validateEmailExisting("hahahamehcanic@yandex.ru");
    
        assert.isOk(res);
    });

    it('update', async () => {
        let res1 = await mechanic.search({email: "hahahamehcanic@yandex.ru"});
        await mechanic.update({id: res1[0].id, email:  "hahahamehcanic@mail.ru", type: UserRoles.mechanic})
        res1 = await mechanic.search({id: res1[0].id});
        assert.isNotOk(res1.length !== 1 || res1[0].email !== "hahahamehcanic@mail.ru");
    });

    it('validate get list of all', async () => {
        let res = await mechanic.getListOfAll(0, 10);
    
        assert.isOk(res.length == 10);
    });

    it('update few users', async () => {
        await mechanic.create({fio: "Hello user",
                    email: "hahahamehcanic1@yandex.ru",
                    password: "123",
                    type: UserRoles.mechanic
                });

        await mechanic.create({fio: "Hello user",
            email: "hahahamehcanic2@yandex.ru",
            password: "123",
            type: UserRoles.mechanic
        });

        await mechanic.create({fio: "Hello user",
                email: "hahahamehcanic3@yandex.ru",
                password: "123",
                type: UserRoles.mechanic
            });
        
        let res1 = await mechanic.search({email: "hahahamehcanic1@yandex.ru"});
        let res2 = await mechanic.search({email: "hahahamehcanic2@yandex.ru"});
        let res3 = await mechanic.search({email: "hahahamehcanic3@yandex.ru"});

        await mechanic.updateByOneTransaction([
            {id: res1[0].id, email:  "hahahamehcanic1@mail.ru", type: UserRoles.mechanic},
            {id: res2[0].id, email:  "hahahamehcanic2@mail.ru", type: UserRoles.mechanic},
            {id: res3[0].id, email:  "hahahamehcanic3@mail.ru", type: UserRoles.mechanic}
        ]);

        res1 = await mechanic.search({id: res1[0].id});
        res2 = await mechanic.search({id: res2[0].id});
        res3 = await mechanic.search({id: res3[0].id});
    
        assert.isNotOk(res1.length !== 1 || res1[0].email !== "hahahamehcanic1@mail.ru" || 
                    res2.length !== 1 || res2[0].email !== "hahahamehcanic2@mail.ru" ||
                    res3.length !== 1 || res3[0].email !== "hahahamehcanic3@mail.ru"
        );
    });
});