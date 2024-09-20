import "reflect-metadata";
import { container } from "tsyringe";
import 'mocha';
import {  BLTestCarCreateCorrectWork, 
          BLTestCarExistsCorrect, 
          BLTestCarCreateErrorInRepository, 
          BLTestCarErrorNotCreate} from './bltest/bltestcar';
import { Car } from "@//bl/realization/car/car";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { expect } from "chai";
import { errorCarInDB, errorNoVin } from "@//bl/errors/car/carerrors";
import { BLTestClientCreateCorrectWork, BLTestClientUpdateCorrectWork } from "./bltest/bltestclient";
import { errorDataAccess, errorUserInDb } from "@//bl/errors/user/usererrors";
import { BLTestApplicationNormal } from "./bltest/bltestapplication";
import { UserRoles } from '@astypes/userinfo/userinfo';
import { Id } from '@astypes/id/id';
import { AdminRepositoryName, ApplicationRepositoryName, CarRepositoryName, ClientRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { BLTestAdminCreateUserExist } from "./bltest/bltestadmin";

describe('create car', () => {
    it('client creates his car', async () => {
      container.register(CarRepositoryName, BLTestCarCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      const prom = await cln.create({run: 3131.3232, color: '', mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745",
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2')}, 
                                    {id: new Id('2'), "type": UserRoles.client});
      expect(prom).is.undefined;
    });

    it('admin creates client car', async () => {
        container.register(CarRepositoryName, BLTestCarCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        const prom = await cln.create({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                      {"id": new Id('2'), "type": UserRoles.admin});
        expect(prom).is.undefined;
      });

    it('client vin innormal', async () => {
        container.register(CarRepositoryName, BLTestCarCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        const own: ClientInfo = {type: UserRoles.client, id: new Id('2')};
        const prom = await cln.create({run: 3131.3232, color: 'pink', mark: "Shevrole Shevrole", VIN: "wdwdw", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2')}, 
                                      {"id": new Id("2"), "type": UserRoles.client})
                                      .catch(
                                        (error) => expect(error.message).to.equal(errorNoVin.NoVin)
                                      );
      });
  
    it('car exist', async () => {
      container.register(CarRepositoryName, BLTestCarExistsCorrect);
      container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      await cln.create({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                    {"id": new Id('2'), "type": UserRoles.client})
        .catch((error) => {
          expect(error.message).to.equal(errorCarInDB.CarExists);
        });
    });

    it('client no exist', async () => {
        container.register(CarRepositoryName, BLTestCarExistsCorrect);
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        await cln.create({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                      {"id": new Id('2'), "type": UserRoles.client})
          .catch((error) => {
            expect(error.message).to.equal(errorUserInDb.userNotExist);
          });
      });

      it('client create car for other client', async () => {
        container.register(CarRepositoryName, BLTestCarCreateCorrectWork);
        container.register(ClientRepositoryName,  BLTestClientUpdateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        await cln.create({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                      {"id": new Id('2'), "type": UserRoles.client})
          .catch((error) => {
            expect(error.message).to.equal(errorDataAccess.impossibleAccess);
          });
      });
  
    it('error in repository', async () => {
      container.register(CarRepositoryName, BLTestCarCreateErrorInRepository);
      container.register(ClientRepositoryName,  BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      await cln.create({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                    {"id": new Id('2'), "type": UserRoles.client})
        .catch((error) => {
          expect(error.message).to.equal("error in create");
        });
    });
  });

  describe('update car', () => {
    it('client updates his car', async () => {
      container.register(CarRepositoryName, BLTestCarExistsCorrect);
      container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      const prom = await cln.update({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                    {"id": new Id('2'), "type": UserRoles.client});
      expect(prom).is.undefined;
    });

    it('admin updates client car', async () => {
        container.register(CarRepositoryName, BLTestCarExistsCorrect);
        container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        const prom = await cln.update({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                      {"id": new Id('2'), "type": UserRoles.admin});
        expect(prom).is.undefined;
      });
  
    it('car not exist', async () => {
      container.register(CarRepositoryName, BLTestCarCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      await cln.update({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                    {"id": new Id('2'), "type": UserRoles.client})
        .catch((error) => {
          expect(error.message).to.equal(errorCarInDB.NoExists);
        });
    });

      it('client update car for other client', async () => {
        container.register(CarRepositoryName, BLTestCarExistsCorrect);
        container.register(ClientRepositoryName,  BLTestClientUpdateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        const cln = new Car();
        await cln.update({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                      year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                      {"id": new Id('2'), "type": UserRoles.client})
          .catch((error) => {
            expect(error.message).to.equal(errorDataAccess.impossibleAccess);
          });
      });
  });

describe('drop car', () => {
    it('drop car correctly', async () => {
      container.register(CarRepositoryName, BLTestCarExistsCorrect);
      container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Car();
      const prom = await cln.drop({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                    year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                    {"id": new Id('2'), "type": UserRoles.admin});
      expect(prom).is.undefined;
    });
});

describe('search car', () => {
  it('search corrrect', async () => {
    container.register(CarRepositoryName, BLTestCarExistsCorrect);
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(ApplicationRepositoryName, BLTestApplicationNormal);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Car();
    const prom = await cln.search({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                  year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                  {"id": new Id('2'), "type": UserRoles.admin});
    expect(prom).deep.equal([{'VIN': 'lol'}]);
  });
  it('search client cars', async () => {
    container.register(CarRepositoryName, BLTestCarExistsCorrect);
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(ApplicationRepositoryName, BLTestApplicationNormal);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Car();
    const prom = await cln.search({run: 3131.3232, mark: "Shevrole Shevrole", VIN: "JH4KA2540GC007745", 
                                  year: 2004, nick: "danzishidanzi", owner: new Id('2'), color: 'pink'}, 
                                  {id: new Id('2'), "type": UserRoles.client});
    expect(prom).deep.equal([{'VIN': 'lol'}]);
  });
});

describe('get list car', () => {
  it('search corrrect', async () => {
    container.register(CarRepositoryName, BLTestCarExistsCorrect);
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(ApplicationRepositoryName, BLTestApplicationNormal);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Car();
    const prom = await cln.getListOfAll({id: new Id('2'), "type": UserRoles.admin});
    expect(prom).deep.equal([{VIN: '2e2e2e2'}, {VIN: 'wwnwkndwn'}]);
  });
});