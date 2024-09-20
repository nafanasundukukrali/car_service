import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { DAInjectionReg } from '@da/dainjection';
import { CarInfo } from '@astypes/carinfo/carinfo';
import { CarRepositoryName, ClientRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { ICarRepository } from '@asinterfaces/repository/ICarRepository.interface';
import { IClientRepository } from '@asinterfaces/repository/IClientRepository.interface';
import { UserRoles } from '@astypes/userinfo/userinfo';

new DAInjectionReg();
const car: ICarRepository = container.resolve(CarRepositoryName);
const client: IClientRepository = container.resolve(ClientRepositoryName);

describe('car repository', () => {
    it('create', async () => {
        let date: Date = new Date();
        date.setUTCFullYear(2000);

        await client.create({fio: "first car user",
                    email: "firstcaruser@yandex.ru",
                    password: "123",
                    phone: "+792674",
                    dateBIrth: date,
                    type: UserRoles.client
                });
        
        let user = await client.search({email: "firstcaruser@yandex.ru"});

        await car.create({
                    VIN: 'vin1',
                    nick: 'nick1',
                    year: 1955,
                    mark: "Elvis Presley's Pink Cadillac",
                    color: 'pink',
                    run: 10000,
                    owner: user[0].id,
                });

        let res = await car.search({VIN: "vin1"});
    
        assert.isNotOk(res.length !== 1 || res[0].VIN !== "vin1");
    });

    it('update', async () => {
        let res1 = await car.search({VIN: 'vin1'});
        await car.update({VIN: res1[0].VIN, mark: 'new mark'})
        res1 = await car.search({VIN: res1[0].VIN});
        assert.isNotOk(res1.length !== 1 || res1[0].mark !== "new mark");
    });

    it('validate get list of all', async () => {
        let res = await car.getListOfAll(0, 10);
    
        assert.isOk(res.length == 10);
    });

    it('drop car', async () => {
        await car.drop({VIN: 'vin1'});
        let res = await car.search({VIN: 'vin1'});
        assert.isOk(res.length === 0);
    });
});