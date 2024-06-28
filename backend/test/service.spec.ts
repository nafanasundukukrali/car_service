import "reflect-metadata";
import { container } from "tsyringe";
import { Box } from "@blrealization/box/box";
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { Id } from "@bltypes/id/id";

import { BLTestClientCreateCorrectWork, BLTestClientCreateErrorUserExist } from "./bltest/bltestclient";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists } from './bltest/bltestmechanic';
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist } from './bltest/bltestadmin';
import { BLTestService } from "./bltest/bltestservice";
import {    ClientRepositoryName, 
            AdminRepositoryName,
            MechanicRepositoryName,
            ServiceRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { deepEqual } from 'assert';
import { expect } from "chai";
import { Service } from "@blrealization/service/service";


describe('search srvice', () => {
    it('correct admin search', async () => {
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(ServiceRepositoryName, BLTestService);
    
      const idAdmin: Id = new Id('23231');
      const idBox: Id = new Id('1');

      const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
      const cln = new Service();
      const prom = await cln.search({id: idBox}, admin);
      let id_1 = new Id('1');
      let id_2 = new Id('2');
      expect(prom).is.deep.equal([{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', }]);
    });

    it('correct mechanic search', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(ServiceRepositoryName, BLTestService);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id('1');
  
        const admin: MechanicInfo = {id: idAdmin, type: UserRoles.mechanic};
        const cln = new Service();
        const prom = await cln.search({id: idBox}, admin);
        let id_1 = new Id('1');
        let id_2 = new Id('2');
        expect(prom).is.deep.equal([{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', }]);
      });

      it('correct client search', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(ServiceRepositoryName, BLTestService);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id('1');
  
        const admin: ClientInfo = {id: idAdmin, type: UserRoles.client};
        const cln = new Service();
        const prom = await cln.search({id: idBox}, admin);
        let id_1 = new Id('1');
        let id_2 = new Id('2');
        expect(prom).is.deep.equal([{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', }]);
      });
      it('admin not exists', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(ServiceRepositoryName, BLTestService);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id('1');
  
        const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
        const cln = new Service();
        await cln.search({id: idBox}, admin)
        .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
      });
  
      it('mechanic not exists', async () => {
          container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
          container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
          container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
          container.register(ServiceRepositoryName, BLTestService);
        
          const idAdmin: Id = new Id('23231');
          const idBox: Id = new Id('1');
    
          const admin: MechanicInfo = {id: idAdmin, type: UserRoles.mechanic};
          const cln = new Service();
          await cln.search({id: idBox}, admin)
          .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
        });
  
        it('client not exitsts', async () => {
          container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
          container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
          container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
          container.register(ServiceRepositoryName, BLTestService);
        
          const idAdmin: Id = new Id('23231');
          const idBox: Id = new Id('1');
    
          const admin: ClientInfo = {id: idAdmin, type: UserRoles.client};
          const cln = new Service();
          await cln.search({id: idBox}, admin)
          .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
        });

});

describe('get list services', () => {
    it('correct admin search', async () => {
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(ServiceRepositoryName, BLTestService);
    
      const idAdmin: Id = new Id('23231');
      const idBox: Id = new Id('1');

      const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
      const cln = new Service();
      const prom = await cln.getListOfAll(admin);
      let id_1 = new Id('1');
      let id_2 = new Id('2');
      expect(prom).is.deep.equal([{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', },
      {'id': new Id('2'), name: 'some', price: 10.00, discription: 'lol', }]);
    });
});
