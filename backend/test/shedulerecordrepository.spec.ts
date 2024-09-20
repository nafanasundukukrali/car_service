import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { BoxRepositoryName, MechanicRepositoryName, ServiceRepositoryName, SheduleRecordRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { DAInjectionReg } from '@da/dainjection';
import { IBoxRepository } from '@asinterfaces/repository/IBoxRepository,interface';
import { ServiceInfo } from '@astypes/serviceinfo/serviceinfo';
import { IServiceRepository } from '@asinterfaces/repository/IServiceRepository.interface';
import { ISheduleRecordRepository } from '@asinterfaces/repository/ISheduleRecordRepository.interface';
import { IMechanicRepository } from '@asinterfaces/repository/IMechanicRepository.interface';
import { MechanicInfo } from '@astypes/mechanicinfo/mechanicinfo';
import { BoxInfo } from '@astypes/boxinfo/boxinfo';
import { SheduleRecordInfo } from '@astypes/shedulerecordinfo/shedulerecordinfo';
import { UserRoles } from '@astypes/userinfo/userinfo';
new DAInjectionReg();
const shedule: ISheduleRecordRepository = container.resolve(SheduleRecordRepositoryName);
const mechanic_test: IMechanicRepository = container.resolve(MechanicRepositoryName);
const box_test: IBoxRepository = container.resolve(BoxRepositoryName);
import { prisma } from '@da/prismaclient';
describe('shedule repository', () => {
    it('create and search', async () => {
        await mechanic_test.create({fio: "Hello user",
                    email: "scheduletest@yandex.ru",
                    password: "123",
                    type: UserRoles.mechanic
                });
        let mechanic: MechanicInfo[] = await mechanic_test.search({email: "scheduletest@yandex.ru"});
        let box: BoxInfo[] = await box_test.search({number: 1});
        const st_date = new Date();
        st_date.setUTCHours(12, 0, 0, 0);

        const end_date = new Date();
        end_date.setUTCHours(13, 0, 0, 0);
        let data = {mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1};
        await shedule.create({mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1});
        let res: SheduleRecordInfo[] = await shedule.search({mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1});
        assert.isOk(res.length == 1);
    });

    it('update and search', async () => {
        let mechanic: MechanicInfo[] = await mechanic_test.search({email: "scheduletest@yandex.ru"});
        let box: BoxInfo[] = await box_test.search({number: 1});
        const st_date = new Date();
        st_date.setUTCHours(12, 0, 0, 0);
        const end_date = new Date();
        end_date.setUTCHours(13, 0, 0, 0);
        let data = {mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1};
        await shedule.create({mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1});
        let record: SheduleRecordInfo[] = await shedule.search({mechanic: mechanic[0].id, box: box[0].id, timeEnd: end_date, timeStart: st_date, day: 1});
        st_date.setUTCHours(20, 0, 0, 0);
        end_date.setUTCHours(21, 0, 0, 0);
        await shedule.update({id: record[0].id, timeEnd: end_date, timeStart: st_date});
        record = await shedule.search({id: record[0].id});
        assert.isOk(record.length == 1 && record[0].timeStart.getUTCHours() == 20)
    });

    it('get all', async () => {
        let res: SheduleRecordInfo[] = await shedule.getListOfAll(10, 10);
        assert.isOk(res.length == 10)
    });
});