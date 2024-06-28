import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { AdminRepositoryName, MechanicRepositoryName, TimeTableRecordRepositoryName} from '@//bl/interfaces/repository/interfacesnames';
import { BLTestAdminCreateUserExist, BLTestAdminNoUser } from './bltest/bltestadmin';
import { BLTestMechanicCreateCorrectWork, BLTestMechanicCreateUserExists } from './bltest/bltestmechanic';
import { BLTestTimeTableRecordCreateCorrectWork, BLTestTimeTableRecordVocationReturnTImeRecords } from './bltest/bltimetablerecord';
import { TimeTableRecord } from '@blrealization/timetablerecord/timetablerecord';
import { errorUserInDb } from '@blerrors/user/usererrors';
import { Id } from '@bltypes/id/id';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { TimeTableRecordList } from '@bltypes/timetablerecordinfo/timetablerecordinfo';

describe('search', () => {
    it('initiator admin not exists', async () => {
      container.register(AdminRepositoryName, BLTestAdminNoUser);
      container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
      container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);


      const cln = new TimeTableRecord();
      const st_date = new Date();
      await cln.search({dateTime: st_date}, {id: new Id('2w2w'), type: UserRoles.admin}).
        catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('initiator mechanic not exists', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateCorrectWork);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
  
  
        const cln = new TimeTableRecord();
        const st_date = new Date();
        await cln.search({dateTime: st_date}, {id: new Id('2w2w'), type: UserRoles.mechanic}).
          catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
    });

    it('initiator search some data', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
  
  
        const cln = new TimeTableRecord();
        const st_date = new Date();
        let res = await cln.search({dateTime: st_date}, {id: new Id('2w2w'), type: UserRoles.admin});

        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(12);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordList = {id: buf1};
        
        assert.isOk(res && clientIn.id.isEqual(res[0].id) )
    });
}); 

describe('get list of all', () => {
    it('initiator admin not exists', async () => {
        container.register(AdminRepositoryName, BLTestAdminNoUser);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordCreateCorrectWork);
  
  
        const cln = new TimeTableRecord();
        const st_date = new Date();
        await cln.getListOfAll({id: new Id('2w2w'), type: UserRoles.admin}).
          catch((error) => expect(error.message).to.equal(errorUserInDb.userNotExist));
      });

      it('initiator search some data', async () => {
        container.register(AdminRepositoryName, BLTestAdminCreateUserExist);
        container.register(MechanicRepositoryName, BLTestMechanicCreateUserExists);
        container.register(TimeTableRecordRepositoryName, BLTestTimeTableRecordVocationReturnTImeRecords);
  
  
        const cln = new TimeTableRecord();
        const st_date = new Date();
        let res = await cln.getListOfAll({id: new Id('2w2w'), type: UserRoles.admin});

        let buf1: Id = new Id("3");
        let startDate: Date = new Date(0);
        startDate.setUTCHours(12);
        let endDate: Date = new Date(0);
        endDate.setUTCHours(18);

        let date: Date = new Date(0);
        date.setUTCDate(4);
        date.setUTCMonth(7);
        date.setUTCFullYear(2026);


        const clientIn: TimeTableRecordList = {id: buf1};
        
        assert.isOk(res && clientIn.id.isEqual(res[0].id) );
    });
});
