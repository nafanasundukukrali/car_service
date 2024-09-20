
import "reflect-metadata";
import { container } from "tsyringe";
import {  BLTestClientCreateCorrectWork, 
          BLTestClientCreateErrorUserExist,
          BLTestClientCreateExistingEmail,
          BLTestClientCreateExistingPhone,
          BLTestClientErrorNotCreateAndSearchRealization,
          BLTestClientListCorrectWork, 
        } from './bltest/bltestclient';
import { Client } from '@blrealization/client/client';
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { expect, assert } from 'chai';
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { Id } from "@astypes/id/id";

import { AdminRepositoryName, ClientRepositoryName, MechanicRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists, BLTestMechanicListNotUndefValidCorrectWork } from "./bltest/bltestmechanic";
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist } from "./bltest/bltestadmin";
import { BLTestClientErrorCreateRealization } from './bltest/bltestclient';
import { BLTestClientUpdateCorrectWork } from "./bltest/bltestclient";
import { BLTestClientSearchCorrectWork } from "./bltest/bltestclient";
import { UserRoles } from "@astypes/userinfo/userinfo";


describe('create client', () => {
  it('correct data input', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork)
    const cln = new Client();
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    const prom = await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today);
    expect(prom).is.undefined;
  });

  it('user exist', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork)
    const cln = new Client();
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userExist);
      });
  });

  it('error in repository', async () => {
    container.register(ClientRepositoryName, BLTestClientErrorCreateRealization);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal("some");
      });
  });

  it('error date older', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    const db = new Date();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(3000);
    await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDateBirth.dateolder);
      });
  });

  it('error date less 18', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    const db = new Date();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    db.setUTCDate(10);
    db.setUTCMonth(3);
    db.setUTCFullYear((new Date()).getFullYear() - 1);

    await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDateBirth.less18);
      });
  });

  it('error existing email', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    const db = new Date();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    db.setUTCDate(10);
    db.setUTCMonth(3);
    db.setUTCFullYear((new Date()).getFullYear() - 20);

    await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorEmail.inccorrect);
      });
  });

  it('error phone', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateExistingEmail);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    const prom = await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "896"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorPhone.inccorrect);
      });
  });

  it('error existing phone', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateExistingPhone);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    const prom = await cln.create({"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "896"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorPhone.inccorrect);
      });
  });

  it('error email', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
    const cln = new Client();
    const db = new Date();
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    const prom = await cln.create({"type": UserRoles.client, "email" : "nikto@nikto", "fio": "wffw", "password" : "ddqq", "dateBIrth": db, "phone": "89678974056"}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorEmail.inccorrect);
      });
  });
});

describe('update client', () => {
  it('correct data input admin', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    const prom = await cln.update({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.admin});
    expect(prom).is.undefined;
  });

  it('correct data input client', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('2w2w');
    const prom = await cln.update({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.client});
    expect(prom).is.undefined;
  });

  it('error user not exist admin', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    await cln.update({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
  });

  it('error user not exist client', async () => {
    container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    await cln.update({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
  });

  it('error in repository', async () => {
    container.register(ClientRepositoryName, BLTestClientErrorNotCreateAndSearchRealization);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(2003);
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    await cln.update({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal("in update rep");
      });
  });

  it('error date older', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear(3000);
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    let today = new Date();
    today.setUTCFullYear(2024);
    today.setUTCMonth(4);
    today.setUTCDate(16);
    today.setUTCMilliseconds(0);
    await cln.update({"id": buf1, "type": UserRoles.client, dateBIrth : db}, {"id": buf2, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDateBirth.dateolder);
      });
  });

  it('error date less 18', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    db.setUTCDate(10);
    db.setUTCMonth(6);
    db.setUTCFullYear((new Date()).getFullYear() - 1);
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    await cln.update({"id": buf1, "type": UserRoles.client, dateBIrth: db}, {"id": buf2, "type": UserRoles.admin}, new Date())
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDateBirth.less18);
      });
  });

  it('error phone', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    const prom = await cln.update({"id": buf1, "type": UserRoles.client, "phone": "896"}, {"id": buf2, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorPhone.inccorrect);
      });
  });

  it('error email', async () => {
    container.register(ClientRepositoryName, BLTestClientUpdateCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id('2w2w');
    let buf2: Id = new Id('1');
    const prom = await cln.update({"id": buf1, "type": UserRoles.client, "email": "@yandex.ru"}, {"id": buf2, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorEmail.inccorrect);
      });
  });
});

describe('search client', () => {
  it('client search client is this client', async () => {
    container.register(ClientRepositoryName, BLTestClientSearchCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id("1");
    const res: ClientInfo = {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"};
    const prom = await cln.search({"id": buf1, "type": UserRoles.client}, {"id": buf1, "type": UserRoles.client});
    expect(prom[0]).to.deep.equal(res);
  });

  it('admin search client', async () => {
    container.register(ClientRepositoryName, BLTestClientSearchCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    let buf1: Id = new Id("1");
    let buf2: Id = new Id("2");
    const prom = await cln.search({"type": UserRoles.client}, {"id": buf2, "type": UserRoles.admin});
    const res: ClientInfo = {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"};
    expect(prom[0]).deep.equal(res);
  });

  it('mechanic search client', async () => {
    container.register(ClientRepositoryName, BLTestClientSearchCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    let buf1: Id = new Id("1");
    let buf2: Id = new Id("2");
    const prom = await cln.search({"id": buf1, "type": UserRoles.client}, {"id": buf2, "type": UserRoles.mechanic});
    const res: ClientInfo = {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "phone": "89678974056"};
    expect(prom[0]).deep.equal(res);
  });

  it('client search list of clients', async () => {
    container.register(ClientRepositoryName, BLTestClientListCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id("1");
    await cln.search({"fio": "fwfwf", "type": UserRoles.client}, {"id": buf1, "type": UserRoles.client})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
      });
  });
});

describe('get all list of clients', () => {
  it('admin search list of clients', async () => {
    container.register(ClientRepositoryName, BLTestClientListCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id("1");
    let buf2: Id = new Id("2");
    let buf3: Id = new Id("3");
    const res = await cln.getListOfAll({"id": buf1, type: UserRoles.admin});
    const clients: ClientInfo[] = [
      {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq", "phone": "89678974056"},
      {"type": UserRoles.client, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "password" : "d3e3dqq", "phone": "89678974056"},
      {"type": UserRoles.client, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "password" : "d33r3r3r3e3dqq", "phone": "89679974056"},
    ];
    expect(res).deep.equal(clients);
  });

  it('mechanic search list of clients', async () => {
    container.register(ClientRepositoryName, BLTestClientListCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id("1");
    let buf2: Id = new Id("2");
    let buf3: Id = new Id("3");
    const res = await cln.getListOfAll({"id": buf1, "type": UserRoles.mechanic});
    const clients: ClientInfo[] = [
      {"type": UserRoles.client, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "phone": "89678974056"},
      {"type": UserRoles.client, "email" : "1nikto@nikto.com", "fio": "wee3effw", "id": buf2, "phone": "89678974056"},
      {"type": UserRoles.client, "email" : "1nik3to@nikto.com", "fio": "wee3effw", "id": buf3, "phone": "89679974056"},
    ];
    expect(res).deep.equal(clients);
  });
  it('mechanic too much initiator', async () => {
    container.register(ClientRepositoryName, BLTestClientListCorrectWork);
    container.register(MechanicRepositoryName, BLTestMechanicListNotUndefValidCorrectWork);
    container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    const cln = new Client();
    const db = new Date();
    let buf1: Id = new Id("1");
    let buf2: Id = new Id("2");
    let buf3: Id = new Id("3");
    const res = await cln.getListOfAll({"id": buf1, "type": UserRoles.mechanic})
    .catch((error) => {
      expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
    });
  });
});
