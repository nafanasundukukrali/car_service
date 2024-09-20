import "reflect-metadata";
import { container } from "tsyringe";
import { AdminRepositoryName, ApplicationRepositoryName, BoxRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { BLTestBoxCorrect, BLTestBoxEmpty } from './bltest/bltestbox';
import { SheduleRecord } from '@blrealization/shedulerecord/shedulerecord';
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist, BLTestAdminNoUser } from './bltest/bltestadmin';
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists } from './bltest/bltestmechanic';
import { BLTestSheduleRecordBoxInThisDay, BLTestSheduleRecordCreateCorrectWork, BLTestSheduleRecordCreateUserExists, BLTestSheduleRecordMehcanicInThisDay, BLTestSheduleRecordMehcanicInThisDayUpdate, BLTestSheduleRecordUpdateNotSameIdSearchResult, BLTestSheduleRecordVocationInfoForMechanic, BLTestSheduleRecordSearchMechanicIdSame } from './bltest/bltestshedular';
import { BLTestTimeTableRecordCreateCorrectWork, BLTestTimeTableRecordCreateUserExists } from './bltest/bltimetablerecord';
import { BLTestApplicationNormal, BLTestApplicationSheduleTest } from './bltest/bltestapplication';
import { expect } from 'chai';
import { errorShedularRecordTimeValidation } from '../src/bl/errors/shedulerecord/shedulerecorderrors';
import { UserRoles } from "@astypes/userinfo/userinfo";
import { Id } from "@astypes/id/id";
import { errorBoxExisting } from "@blerrors/box/boxerrors.";
import { errorDataAccess, errorUserInDb } from "@blerrors/user/usererrors";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { ISheduleRecordRepository } from "@asinterfaces/repository/ISheduleRecordRepository.interface";
import { errorDirtyShedular } from "@//bl/errors/serviceerrors/serviceerrors";

describe('create', () => {
    it('box not exist', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.create({mechanic: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorBoxExisting.boxNotExists));
    });

    it('initiator not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxCorrect);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.create({box: new Id('1'), mechanic: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('mechanic not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxCorrect);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.create({box: new Id('1'), mechanic: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('no start time in requiest', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        const end_date = new Date();

        await cln.create({mechanic: new Id("1"), day: 1, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorShedularRecordTimeValidation.notEnoughInfo));
      });

      it('no end time in requiest', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        const end_date = new Date();

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorShedularRecordTimeValidation.notEnoughInfo));
      });

      it('end time less start time in requiest', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateCorrectWork);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        const end_date = new Date();

        await cln.create({mechanic: new Id("1"), day: 1, timeEnd: st_date, timeStart: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorShedularRecordTimeValidation.notEnoughInfo));
      });

      it('mechanic records in this period: end is other start', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date(0);
        st_date.setUTCHours(12, 0, 0, 0);
        const end_date = new Date(0);
        end_date.setUTCHours(13, 0, 0, 0);
        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin});
      });

      it('mechanic records in this period: end greater than other start', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(12);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('mechanic records in this period: start same as start of ther period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(13);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('mechanic records in this period: in another period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(30);
        st_date.setUTCHours(13);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(25);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('mechanic records in this period: start greater than start, end greater than end', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(14);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(16);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('mechanic records in this period: contains period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(12);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(16);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('box records in this period: end is other start', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(12);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(0);
        end_date.setUTCHours(13);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin});
      });

      it('box records in this period: end greater than other start', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(12);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('box records in this period: start same as start of ther period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(13);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('box records in this period: in another period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(30);
        st_date.setUTCHours(13);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(25);
        end_date.setUTCHours(14);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('box records in this period: start greater than start, end greater than end', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(14);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(16);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });

      it('box records in this period: contains period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordBoxInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const st_date = new Date();
        st_date.setUTCMilliseconds(0);
        st_date.setMinutes(0);
        st_date.setUTCHours(12);

        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(31);
        end_date.setUTCHours(16);

        await cln.create({mechanic: new Id("1"), day: 1, timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin})
          .catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });
  }); 

describe('update', () => {
    it('initiator not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.update({id: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

      it('end time less start time in requiest', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDayUpdate);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(0);
        end_date.setUTCHours(13);

        await cln.update({id: new Id("1"), day: 1, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorShedularRecordTimeValidation.notEnoughInfo));
      });

      it('after change period same as other period', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const start_date = new Date();
        start_date.setUTCMilliseconds(0);
        start_date.setMinutes(0);
        start_date.setUTCHours(17);
        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(30);
        end_date.setUTCHours(17);

        await cln.update({id: new Id("1"), day: 1,  timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorDirtyShedular.addedRecordIncorrect));
      });
  }); 

describe('archive', () => {
    it('initiator not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.archive({id: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

      it('archive correct work', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordMehcanicInThisDay);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationSheduleTest);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        const start_date = new Date();
        start_date.setUTCMilliseconds(0);
        start_date.setMinutes(0);
        start_date.setUTCHours(17);
        const end_date = new Date();
        end_date.setUTCMilliseconds(0);
        end_date.setMinutes(30);
        end_date.setUTCHours(17);

        await cln.update({id: new Id("1"), day: 1,  timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin});
      });
  }); 

  describe('search', () => {
    it('initiator admin not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.search({id: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('initiator mechanic not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.search({id: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.mechanic}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('initiator mechanic not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.search({id: new Id("3"), timeStart: st_date, timeEnd: end_date}, {id: new Id('2w2w'), type: UserRoles.mechanic}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

      it('search correct work for admin', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordUpdateNotSameIdSearchResult);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationSheduleTest);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: new Id("1"), day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: new Id("2"), day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        let search = [clientIn1, clientIn2];

        let res = await cln.search({id: new Id("1"), day: 1}, {id: new Id('2w2w'), type: UserRoles.admin});
        expect(res).to.deep.equal(search);
      });

      it('search correct work for mehcanic', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordSearchMechanicIdSame);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationSheduleTest);
        container.register(BoxRepositoryName, BLTestBoxCorrect);

        const cln = new SheduleRecord();
        let buf1: Id = new Id("3");
        let startDate1: Date = new Date(0);
        startDate1.setUTCHours(12);
        let endDate1: Date = new Date(0);
        endDate1.setUTCHours(18);
        const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: new Id('2w2w'), day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
        let buf2: Id = new Id("4");
        let startDate2: Date = new Date(0);
        startDate2.setUTCHours(18);
        let endDate2: Date = new Date(0);
        endDate2.setUTCHours(18);
        const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: new Id('2w2w'), day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
        let search = [clientIn1, clientIn2];

        let res = await cln.search({id: new Id("1"), day: 1}, {id: new Id('2w2w'), type: UserRoles.mechanic});
        expect(res).to.deep.equal(search);
      });
  }); 

  describe('get list of all', () => {
    it('initiator admin not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      const st_date = new Date();
      const end_date = new Date();
      await cln.getListOfAll({id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('get list of all works', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordUpdateNotSameIdSearchResult);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(BoxRepositoryName, BLTestBoxEmpty);

      const cln = new SheduleRecord();
      let buf1: Id = new Id("3");
      let startDate1: Date = new Date(0);
      startDate1.setUTCHours(12);
      let endDate1: Date = new Date(0);
      endDate1.setUTCHours(18);
      const clientIn2: SheduleRecordInfo = {id: buf1, mechanic: new Id("1"), day: 1, timeStart: startDate1, timeEnd: endDate1, box: buf1};
      let buf2: Id = new Id("4");
      let startDate2: Date = new Date(0);
      startDate2.setUTCHours(18);
      let endDate2: Date = new Date(0);
      endDate2.setUTCHours(18);
      const clientIn1: SheduleRecordInfo = {id: buf2, mechanic: new Id("2"), day: 2, timeStart: startDate2, timeEnd: endDate2, box: buf1};
      let res = [clientIn1, clientIn2];

      await cln.getListOfAll({id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });
  }); 