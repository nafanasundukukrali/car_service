import "reflect-metadata";
import { container } from "tsyringe";
import { expect, assert } from 'chai';
import 'mocha';
import * as errors from '../src/bl/errors/user/usererrors';
import { Id } from "@bltypes/id/id";
import { MechanicInfo } from "@//bl/types/mechanicinfo/mechanicinfo";
import { Mechanic } from "@//bl/realization/mechanic/mechanic";
import { IMechanicRepository } from "@//bl/interfaces/repository/IMechanicRepository.interface";
import { BLTestAdminCreateUserExist } from "./bltest/bltestadmin";
import { AdminRepositoryName, ApplicationRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName } from "@//bl/interfaces/repository/interfacesnames";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists, BLTestMechanicCreateExistingEmail } from './bltest/bltestmechanic';
import { BLTestSheduleRecordCreateUserExists } from './bltest/bltestshedular';
import { BLTestTimeTableRecordCreateCorrectWork } from "./bltest/bltimetablerecord";
import { BLTestApplicationNormal } from "./bltest/bltestapplication";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { MechanicStatus } from '../src/bl/types/mechanicstatus/mechanicstatus';
import { BaseStatus } from "@bltypes/basestatus/basestatus";
import { AchivedStatusType } from "@//bl/types/achivedstatus/achivedstatus";

describe('create mehcanic', () => {
    it('correct data input', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal)

      const cln = new Mechanic();
      let buf: Id = new Id('2w2w');
      const prom = await cln.create({"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
      expect(prom).is.undefined;
    });
  
    it('user exist', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        const prom = await cln.create({"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userExist);
        });
    });
  
    it('error email', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal)
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        const prom = await cln.create({"type": UserRoles.mechanic, "email" : "niktonikto.com", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorEmail.inccorrect);
        });
    });

    it('error existing', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateExistingEmail);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal)
      const cln = new Mechanic();
      let buf: Id = new Id('2w2w');
      const prom = await cln.create({"type": UserRoles.mechanic, "email" : "niktonikto.com", "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorEmail.inccorrect);
      });
   });
  });

  describe('update mechanic', () => {
    it('correct data update', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        const prom = await cln.update({"type": UserRoles.mechanic, "email" : "nikto@nikto.com", id: buf, "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
        expect(prom).is.undefined;
    });
  
    it('error email', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal)
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        const prom = await cln.update({"type": UserRoles.mechanic, "email" : "niktonikto.com", id: buf, "fio": "wffw", "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorEmail.inccorrect);
        });
    });
  });

  describe('archive mechanic', () => {
    it('correct achive no shedular', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        let rec: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", id: buf, "fio": "wffw", "password" : "ddqq", status: BaseStatus.stored};
        const prom = await cln.archive(rec, {"id": buf, "type": UserRoles.admin});
        expect(rec.status).to.deep.equal(AchivedStatusType.archived);
    });

    it('correct achive shedular', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        const cln = new Mechanic();
        let buf: Id = new Id('2w2w');
        let rec: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", id: buf, "fio": "wffw", "password" : "ddqq", status: BaseStatus.stored};
        const prom = await cln.archive(rec, {"id": buf, "type": UserRoles.admin});
        expect(rec.status).to.deep.equal(AchivedStatusType.archived);
    });
  });

  describe('search mechanic', () => {
    it('mechanic search self info', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        const cln = new Mechanic();
        let buf: Id = new Id('3');
        let searcher: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"};
        let rec: Partial<MechanicInfo> = {"email" : "nikto@nikto.com"};
        const prom = await cln.search(rec, searcher);
        expect(prom[0]).to.deep.equal(searcher);
    });

    // it('correct achive shedular', async () => {
    //     container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
    //     container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
    //     container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
    //     container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
    //     container.register(ApplicationRepositoryName, BLTestApplicationNormal);
    //     const cln = new Mechanic();
    //     let buf: Id = new Id('2w2w');
    //     let rec: MechanicInfo = {"type": UserRoles.mechanic, "email" : "nikto@nikto.com", id: buf, "fio": "wffw", "password" : "ddqq", status: BaseStatus.stored};
    //     const prom = await cln.archive(rec, {"id": buf, "type": UserRoles.admin});
    //     expect(rec.status).to.deep.equal(AchivedStatusType.archived);
    // });
  });





































//   describe('search admin', () => {
//     it('correct data seacrh', async () => {
//       container.register("AdminRepository", BLTestAdminNotCreateCorrectWork);
//       const cln = new Admin();
//       let buf: Id = new Id('2w2w');
//       const prom = await cln.search({"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin});
//       let res: AdminInfo = {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf, "password" : "ddqq"};
//       expect(prom[0]).deep.equal(res);
//     });

//     it('admin not exist', async () => {
//         container.register(AdminRepositoryName, BLTestAdminNotExists);
//       const cln = new Admin();
//       let buf: Id = new Id('2w2w');
//       await cln.search({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"}, {"id": buf, "type": UserRoles.admin})
//         .catch((error) => {
//           expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
//         });
//     });
//   });

//   describe('get list of all admina', () => {
//     it('correct data get', async () => {
//         let buf1: Id = new Id("1");
//         let buf2: Id = new Id("2");
//         let buf3: Id = new Id("3");

//       container.register("AdminRepository", BLTestAdminNotCreateCorrectWork);
//       const cln = new Admin();
//       const prom = await cln.getListOfAll({"id": buf1, "type": UserRoles.admin}, 5, 6);
//       let res: AdminInfo[] = [{"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf1, "password" : "ddqq"},
//                                 {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf2, "password" : "ddqq"},
//                                 {"type": UserRoles.admin, "email" : "nikto@nikto.com", "fio": "wffw", "id": buf3, "password" : "ddqq"}]
//       expect(prom).deep.equal(res);
//     });
//     it('admin not exist', async () => {
//         container.register(AdminRepositoryName, BLTestAdminNotExists);
//       const cln = new Admin();
//       let buf: Id = new Id('2w2w');
//       await cln.getListOfAll({"type": UserRoles.admin, "email" : "nikto@nikto.com", "id": buf, "fio": "wffw",  "password" : "ddqq"})
//         .catch((error) => {
//           expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
//         });
//     });
//   });