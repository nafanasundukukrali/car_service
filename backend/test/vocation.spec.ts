import "reflect-metadata";
import { container } from "tsyringe";
import { expect, assert } from 'chai';
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { Id } from "@astypes/id/id";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { Mechanic } from "@blrealization/mechanic/mechanic";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist } from './bltest/bltestadmin';
import { AdminRepositoryName, ApplicationRepositoryName, ClientRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName, VocationRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists, BLTestMechanicVocationTest } from './bltest/bltestmechanic';
import { BLTestSheduleRecordCreateCorrectWork, BLTestSheduleRecordCreateUserExists, BLTestSheduleRecordVocationInfoForMechanic } from './bltest/bltestshedular';
import { BLTestTimeTableRecordCreateCorrectWork, BLTestTimeTableRecordVocationReturnTImeRecords } from "./bltest/bltimetablerecord";
import { BLTestApplicationNormal, BLTestApplicationVocationAllToDirty, BLTestApplicationVocationNotAllDirty } from "./bltest/bltestapplication";
import { Vocation } from "@blrealization/vocation/vocation";
import { BLTestNightVocationUpdateTest, BLTestVocationCreateCorrectWork, BLTestVocationCreateUserExists, BLTestVocationSearchPeriods } from "./bltest/bltestvocation";
import { errorVocationDrop, errorVocationExisting, errorVocationPlane } from '@blerrors/vocation/vocationerror';
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from "@astypes/positiveinteger";
import { BLTestClientCreateErrorUserExist } from "./bltest/bltestclient";

describe('plane vocation', () => {
    it ('not existing admin', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('not existing mechanic', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('end more than start date', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2025);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(11);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.startDateOlderEnd);
              });
    });
    it ('end equal start date', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2025);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.startDateOlderEnd);
              });
    });
    it ('today == end vocation date', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2025);
      today.setUTCMonth(12);
      today.setUTCDate(2);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.todayIsVocationDay);
              });
    });
    it ('today == start vocation date', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(12);
      today.setUTCDate(2);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.todayIsVocationDay);
              });
    });
    it ('today in vocation period', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.userInVocationInThisPeriod);
              });
    });
    it ('mehcanic has other vocation period (end date in other voc)', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationSearchPeriods);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2023);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errorVocationPlane.userInVocationInThisPeriod);
      });
    });

    it ('mehcanic has other vocation period (start date in other voc)', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationSearchPeriods);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2026);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errorVocationPlane.userInVocationInThisPeriod);
      });
    });

    it ('mehcanic has other vocation period (voc in existing voc)', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationSearchPeriods);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2023);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(30);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2027);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errorVocationPlane.userInVocationInThisPeriod);
      });
    });

    it ('there are saved records in vocation period', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordVocationInfoForMechanic);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationVocationAllToDirty);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today);
    });

    it ('there are no saved records in vocation period, but there are other status records', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordVocationInfoForMechanic);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationVocationNotAllDirty);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.planeVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today);
    });
  });

  describe('drop vocation', () => {
    it ('mechanic not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.dropVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('admin not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.dropVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('today is vocation', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(1);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      const prom = await cln.dropVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationPlane.todayIsVocationDay);
              });
    });

    it ('vocation not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(12);
      startDate.setUTCDate(2);
      let endDate = new Date();
      endDate.setUTCFullYear(2025);
      endDate.setUTCMonth(12);
      endDate.setUTCDate(2);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.dropVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today)
      .catch((error) => {
                expect(error.message).to.equal(errorVocationExisting.vocationNotExists);
              });
    });

    it ('correct vocation drop', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordVocationInfoForMechanic);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationVocationAllToDirty);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.dropVocation({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin}, today);
    });
  });

  describe('search', () => {
    it ('admin and not existing', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.search({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('mechanic not existing', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateCorrectWork);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.search({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.mechanic})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('mechanic search not his info', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordVocationInfoForMechanic);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationVocationAllToDirty);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.search({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": new Id('35'), "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
      });
    });
    it ('correct search', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordVocationInfoForMechanic);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationVocationAllToDirty);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2023);
      today.setUTCMonth(11);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.search({who: buf, startDate: startDate, endDate: endDate, id: buf}, {"id": buf, "type": UserRoles.admin});
    });
  });

  describe('get list of all vocations', () => {
    it ('admin not existing', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.getListOfAll( {"id": buf, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });
    it ('correct get list of all (not partition)', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      let startDate = new Date();
      startDate.setUTCFullYear(2024);
      startDate.setUTCMonth(6);
      startDate.setUTCDate(2);
      startDate.setUTCMilliseconds(0);
      let endDate = new Date();
      endDate.setUTCFullYear(2024);
      endDate.setUTCMonth(6);
      endDate.setUTCDate(9);
      endDate.setUTCMilliseconds(0);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const prom = await cln.getListOfAll( {"id": buf, "type": UserRoles.admin})
      let buf1: Id = new Id("3");
        let startDatet = new Date();
        startDatet.setUTCFullYear(2024);
        startDatet.setUTCMonth(12);
        startDatet.setUTCDate(2);
        let endDatet = new Date();
        endDatet.setUTCFullYear(2025);
        endDatet.setUTCMonth(12);
        endDatet.setUTCDate(2);
        const clientIn = {who: buf1, startDate: startDatet, endDate: endDatet, id: buf1};
      assert.isNotOk(clientIn.who == prom[0].who);
    });
    it ('correct get list of all (partition)', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Vocation();
      let buf: Id = new Id('1');
      const prom = await cln.getListOfAll( {"id": buf, "type": UserRoles.admin}, 1 as PositiveInteger, 2 as PositiveInteger)
      let buf1: Id = new Id("3");
        let startDatet = new Date();
        startDatet.setUTCFullYear(2024);
        startDatet.setUTCMonth(12);
        startDatet.setUTCDate(2);
        let endDatet = new Date();
        endDatet.setUTCFullYear(2025);
        endDatet.setUTCMonth(12);
        endDatet.setUTCDate(2);
        const clientIn = {who: buf1, startDate: startDatet, endDate: endDatet, id: buf1};
        assert.isNotOk(clientIn.who == prom[0].who);
    });
  });

  describe('validate today vocation shedular of mechanics', () => {
    it ('correct works', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicVocationTest);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestNightVocationUpdateTest);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      let today = new Date();
      today.setUTCFullYear(2024);
      today.setUTCMonth(4);
      today.setUTCDate(16);
      today.setUTCMilliseconds(0);
      const cln = new Vocation();
      const prom = await cln.validateTodayVocation(today);
    });
  });