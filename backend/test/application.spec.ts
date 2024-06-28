import "reflect-metadata";
import { container } from "tsyringe";
import { expect } from 'chai';
import 'mocha';
import * as errors from '@blerrors/user/usererrors';
import { Id } from "@bltypes/id/id";
import { AdminRepositoryName,
        MechanicRepositoryName,
        SheduleRecordRepositoryName,
        TimeTableRecordRepositoryName,
        ApplicationRepositoryName,
        VocationRepositoryName,
        ClientRepositoryName,
        CarRepositoryName
 } from "@blinterfaces/repository/interfacesnames";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { Application } from "@blrealization/application/application";
import { BLTestAdminCreateCorrectWork, BLTestAdminCreateUserExist, BLTestAdminNoUser } from "./bltest/bltestadmin";
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists } from "./bltest/bltestmechanic";
import { BLTestSheduleRecordApplicatioCorrectTest, BLTestSheduleRecordCreateUserExists } from "./bltest/bltestshedular";
import { BLTestTimeTableRecordCreateUserExists, BLTestTimeTableRecordVocationReturnTImeRecords } from "./bltest/bltimetablerecord";
import { BLTestApplicationCheckStatus, BLTestApplicationNormal } from "./bltest/bltestapplication";
import { BLTestVocationCreateCorrectWork, BLTestVocationCreateUserExists } from "./bltest/bltestvocation";
import { BLTestClientCreateCorrectWork, BLTestClientCreateErrorUserExist } from "./bltest/bltestclient";
import { TimeTableRecordInfo } from "@//bl/types/timetablerecordinfo/timetablerecordinfo";
import { errorImpossibleCreateTimeTableRecord, errorImpossibleUpdateRecord } from "@//bl/errors/timetablerecord/timtablerecorderrors";
import { BLTestCarApplicationCcorect, BLTestCarApplicationInccorect, BLTestCarExistsCorrect } from "./bltest/bltestcar";

describe('create application', () => {
    it ('not existing mechanic', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.create({client: buf}, {"id": buf, "type": UserRoles.mechanic})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
      });

      it ('not existing client', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.create({client: buf}, {"id": buf, "type": UserRoles.client})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
      });

      it ('corect works (check status!)', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
        container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.create({client: buf}, {"id": buf, "type": UserRoles.client});
      });
    }
);

describe('update application', () => {
    it ('not existing mechanic', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.update({id: buf, client: buf}, {"id": buf, "type": UserRoles.mechanic})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
      });

      it ('not existing admin', async () => {
        container.register(AdminRepositoryName, BLTestAdminNoUser);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.update({id: buf, client: buf}, {"id": buf, "type": UserRoles.admin})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
        });
      });

    it ('not enought mechanic info', async () => {
        container.register(AdminRepositoryName, BLTestAdminNoUser);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationNormal);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
        const cln = new Application();
        let buf: Id = new Id('1');
        const prom = await cln.update({id: buf, client: buf}, {"id": buf, "type": UserRoles.mechanic})
        .catch((error) => {
          expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
        });
      });

    it ('same timerecords', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
        container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        let date = new Date();
        date.setUTCMilliseconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);
        let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 5}
        const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin});
        expect(prom).is.undefined;
      });

      it ('not enough info for check timetable', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
        container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        let date = new Date();
        date.setUTCMilliseconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);
        date.setUTCDate(date.getDate() + 10)
        let timerec: TimeTableRecordInfo = {id: buf, dateTime: date, duration: 5}
        const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
            .catch((error) => {
                expect(error.message).is.equal(errorImpossibleUpdateRecord.noSheduleInfo)
            })
      });

      it ('end of procedure is next day', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
        container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        let date = new Date();
        date.setUTCMilliseconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(22);
        date.setUTCDate(date.getUTCDate() + 10)
        let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 5}
        const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
            .catch((error) => {
                expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.theEndDateIsNextDay)
            })
      });

      it ('schedule record starts later', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
        container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
        container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
        container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
        const cln = new Application();
        let buf: Id = new Id('1');
        let date = new Date();
        date.setUTCMilliseconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(10);
        date.setUTCDate(date.getUTCDate())
        let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
        const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
            .catch((error) => {
                expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.durationMoreShedularEnd)
            })
      });

    it ('schedule record starts earlier', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(21);
      date.setUTCDate(date.getUTCDate() + 7)
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
      const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
          .catch((error) => {
              expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.durationMoreShedularEnd)
          })
    });

    it ('schedule record ends after schedular period', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(17);
      date.setUTCDate(date.getUTCDate() + 7)
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 4}
      const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
          .catch((error) => {
              expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.durationMoreShedularEnd)
          })
    });

    it ('schedule not same dayweek', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(16);
      date.setUTCDate(date.getUTCDate() + 4)
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
      const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
          .catch((error) => {
              expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.notSameDayweek)
          })
    });

    it ('there are record in same period', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(16);
      date.setUTCDate(date.getUTCDate() + 4)
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
      const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
          .catch((error) => {
              expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.notSameDayweek)
          })
    });

    it ('there are other time table', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(16);
      date.setUTCDate(date.getUTCDate() + 7)
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
      const prom = await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin})
          .catch((error) => {
              expect(error.message).is.equal(errorImpossibleCreateTimeTableRecord.sameRecords)
          })
    });

    it ('correct update', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordApplicatioCorrectTest);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
      container.register(ApplicationRepositoryName, BLTestApplicationCheckStatus);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      let date = new Date();
      date.setUTCMilliseconds(0);
      date.setUTCMinutes(0);
      date.setUTCDate(date.getUTCDate() + 7)
      date.setUTCHours(10);
      let timerec: TimeTableRecordInfo = {id: buf, sheduleRecord: buf, dateTime: date, duration: 1}
      await cln.update({id: buf, client: buf, timeRecord: timerec}, {"id": buf, "type": UserRoles.admin});
    });
  }
);

describe('search application', () => {
  it ('not existing mechanic', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf}, {"id": buf, "type": UserRoles.mechanic})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });

    it ('not existing client', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateCorrectWork);
      container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf}, {"id": buf, "type": UserRoles.client})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });

    it ('not existing admin', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf}, {"id": buf, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });

    it ('not car info', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf}, {"id": buf, "type": UserRoles.client})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
      });
    });

    it ('car owner not same', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(CarRepositoryName, BLTestCarApplicationInccorect);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf, car: "1"}, {"id": buf, "type": UserRoles.client})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
      });
    });

    it ('correcct works', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(CarRepositoryName, BLTestCarApplicationCcorect);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.search({client: buf, car: "1"}, {"id": buf, "type": UserRoles.client})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorDataAccess.impossibleAccess);
      });
    });
  }
);

describe('get list of all application', () => {
    it ('not existing admin', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateCorrectWork);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.getListOfAll({"id": buf, "type": UserRoles.admin})
      .catch((error) => {
        expect(error.message).to.equal(errors.errorUserInDb.userNotExist);
      });
    });

    it ('correct', async () => {
      container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(SheduleRecordRepositoryName, BLTestSheduleRecordCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateUserExists);
      container.register(ApplicationRepositoryName, BLTestApplicationNormal);
      container.register(VocationRepositoryName, BLTestVocationCreateUserExists);
      container.register(ClientRepositoryName, BLTestClientCreateErrorUserExist);
      const cln = new Application();
      let buf: Id = new Id('1');
      const prom = await cln.getListOfAll({"id": buf, "type": UserRoles.admin})
    });
  }
);
