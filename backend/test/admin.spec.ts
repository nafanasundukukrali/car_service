import "reflect-metadata";
import { container } from "tsyringe";
import { Admin } from "@blrealization/admin/admin";
import { expect, assert } from 'chai';
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateExistingEmail, BLTestAdminCreateUserExist, BLTestAdminNotCreateCorrectWork, BLTestAdminNotExists, BLTestAdminUpdateInfoUser} from "./bltest/bltestadmin";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { Id } from "@astypes/id/id";
import { AdminRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from '@astypes/positiveinteger';

describe('create admin', () => {
    it('correct data input', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.create({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
      expect(prom).is.undefined;
    });
  
    it('user exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.create({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw",  "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userExist);
        });
    });

    it('admin not exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminNotExists);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.create({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw",  "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });
  
    it('error email', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.create({"type": UserRoles.admin, "email" : "niktonikto", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorEmail.inccorrect);
        });
    });

    it('existing email', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateExistingEmail);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.create({"type": UserRoles.admin, "email" : "niktonikto", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorEmail.inccorrect);
        });
    });
  });

  describe('update admin', () => {
    it('correct data update', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.update({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
      expect(prom).is.undefined;
    });

    it('admin not exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminNotExists);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.update({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });

    it('admin not exist in info', async () => {
        container.register(AdminRepositoryName, BLTestAdminUpdateInfoUser);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      let buf1: Id = new Id('1');
      await cln.update({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"}, {"id": buf1, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });
  
    it('user not exist', async () => {
      container.register("AdminRepository", BLTestAdminCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.update({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });
  
    it('error email', async () => {
      container.register("AdminRepository", BLTestAdminNotCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.update({"type": UserRoles.admin, "email" : "niktonikto", "fio": "wffw", "id": buf, "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorEmail.inccorrect);
        });
    });
  });

  describe('search admin', () => {
    it('correct data seacrh', async () => {
      container.register("AdminRepository", BLTestAdminNotCreateCorrectWork);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      const prom = await cln.search({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
      let res: AdminInfo = {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"};
      expect(prom[0]).deep.equal(res);
    });

    it('admin not exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminNotExists);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.search({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });
  });

  describe('get list of all admina', () => {
    it('correct data get', async () => {
        let buf1: Id = new Id("1");
        let buf2: Id = new Id("2");
        let buf3: Id = new Id("3");

      container.register("AdminRepository", BLTestAdminNotCreateCorrectWork);
      const cln = new Admin();
      const prom = await cln.getListOfAll({"id": buf1, "type": UserRoles.admin}, 5 as PositiveInteger, 6 as PositiveInteger);
      let res: AdminInfo[] = [{"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
                                {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf2, "password" : "ddqq"},
                                {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf3, "password" : "ddqq"}]
      expect(prom).deep.equal(res);
    });
    it('admin not exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminNotExists);
      const cln = new Admin();
      let buf: Id = new Id('2w2w');
      await cln.getListOfAll({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
    });
  });