import "reflect-metadata";
import { container } from "tsyringe";
import { Box } from "@blrealization/box/box";
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { Id } from "@bltypes/id/id";

import { BLTestClientCreateCorrectWork, BLTestClientCreateErrorUserExist } from "./bltest/bltestclient";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists } from './bltest/bltestmechanic';
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist } from './bltest/bltestadmin';
import { BLTestBoxCorrect } from "./bltest/bltestbox";
import {    ClientRepositoryName, 
            AdminRepositoryName,
            MechanicRepositoryName,
            BoxRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { deepEqual } from 'assert';
import { expect } from "chai";

describe('search Box', () => {
    it('correct admin search', async () => {
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(BoxRepositoryName, BLTestBoxCorrect);
    
      const idAdmin: Id = new Id('23231');
      const idBox: Id = new Id(1);

      const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
      const cln = new Box();
      const prom = await cln.search({id: idBox, number: 1}, admin);
      let id_1 = new Id('1');
      let id_2 = new Id('2');
      expect(prom).is.deep.equal([{id: id_1, number: 1}]);
    });

    it('correct mechanic search', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(BoxRepositoryName, BLTestBoxCorrect);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id(1);
  
        const admin: MechanicInfo = {id: idAdmin, type: UserRoles.mechanic};
        const cln = new Box();
        const prom = await cln.search({id: idBox, number: 1}, admin);
        let id_1 = new Id('1');
        let id_2 = new Id('2');
        expect(prom).is.deep.equal([{id: id_1, number: 1}]);
      });

      it('correct client search', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(BoxRepositoryName, BLTestBoxCorrect);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id(1);
  
        const admin: ClientInfo = {id: idAdmin, type: UserRoles.client};
        const cln = new Box();
        const prom = await cln.search({id: idBox, number: 1}, admin);
        let id_1 = new Id('1');
        let id_2 = new Id('2');
        expect(prom).is.deep.equal([{id: id_1, number: 1}]);
      });
      it('admin not exists', async () => {
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(BoxRepositoryName, BLTestBoxCorrect);
      
        const idAdmin: Id = new Id('23231');
        const idBox: Id = new Id(1);
  
        const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
        const cln = new Box();
        await cln.search({id: idBox, number: 1}, admin)
        .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
      });
  
      it('mechanic not exists', async () => {
          container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
          container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
          container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
          container.register(BoxRepositoryName, BLTestBoxCorrect);
        
          const idAdmin: Id = new Id('23231');
          const idBox: Id = new Id(1);
    
          const admin: MechanicInfo = {id: idAdmin, type: UserRoles.mechanic};
          const cln = new Box();
          await cln.search({id: idBox, number: 1}, admin)
          .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
        });
  
        it('client not exitsts', async () => {
          container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
          container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
          container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
          container.register(BoxRepositoryName, BLTestBoxCorrect);
        
          const idAdmin: Id = new Id('23231');
          const idBox: Id = new Id(1);
    
          const admin: ClientInfo = {id: idAdmin, type: UserRoles.client};
          const cln = new Box();
          await cln.search({id: idBox, number: 1}, admin)
          .catch((error) => {
            expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
          });
        });

});

describe('get list Box', () => {
    it('correct admin search', async () => {
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(BoxRepositoryName, BLTestBoxCorrect);
    
      const idAdmin: Id = new Id('23231');
      const idBox: Id = new Id(1);

      const admin: AdminInfo = {id: idAdmin, type: UserRoles.admin};
      const cln = new Box();
      const prom = await cln.getListOfAll(admin);
      let id_1 = new Id('1');
      let id_2 = new Id('2');
      expect(prom).is.deep.equal([{id: id_1, number: 1}, {id: id_2, number: 2}]);
    });
});