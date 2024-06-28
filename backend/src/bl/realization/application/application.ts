import { container, injectable } from "tsyringe";
import { IApplicationRepository } from "@blinterfaces/repository/IApplicationRepository.interface";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { IMechanicRepository } from "@blinterfaces/repository/IMechanicRepository.interface";
import { IAdminRepository } from "@blinterfaces/repository/IAdminRepository.interface";
import { ApplicationInfo } from "@bltypes/applicationinfo/applicationinfo";
import {  errorDataAccess } from "@blerrors/user/usererrors";
import { ITimeTableRecordRepository } from "@blinterfaces/repository/ITimeTableRecordRepository.interface";
import { ClientInfo } from '@bltypes/clientinfo/clientinfo';
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { IClientRepository } from "@blinterfaces/repository/IClientRepository.interface";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { setCreatedStatus, setSavedStatus } from "../applicationstatus/applicationstatus";
import { TimeTableRecordInfo} from '@bltypes/timetablerecordinfo/timetablerecordinfo';
import { ISheduleRecordRepository } from "@blinterfaces/repository/ISheduleRecordRepository.interface";
import { errorApplicationExisting } from "@blerrors/application/applicationerrors";
import { errorImpossibleCreateTimeTableRecord, errorImpossibleUpdateRecord } from "@blerrors/timetablerecord/timtablerecorderrors";
import { Id } from "@bltypes/id/id";
import { ICarRepository } from "@blinterfaces/repository/ICarRepository.interface";
import { CarInfo } from "@bltypes/carinfo/carinfo";
import { RealizationBase } from "../realizationbase";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { IApplication } from "@blinterfaces/realization/IApplication.interface";
import { AdminRepositoryName, ClientRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName, ApplicationRepositoryName, CarRepositoryName } from '../../interfaces/repository/interfacesnames';
import { PositiveInteger } from "@bltypes/positiveinteger"
import { log } from "console";

@injectable()
export class Application extends RealizationBase implements IApplication
{
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;
    private _timeTableRecordRepository: ITimeTableRecordRepository;
    private _clientRepository: IClientRepository;
    private _applicationRepository: IApplicationRepository;
    private _shedularRepository: ISheduleRecordRepository;
    private _carRepository: ICarRepository;

    private async _validate_existing_application(info: Partial<ApplicationInfo>)
    {
        let arr: ApplicationInfo[] = await this._applicationRepository.search(info);

        return arr.length >= 1;
    }

    private async _validate_timerecord_info(info: TimeTableRecordInfo | Partial<TimeTableRecordInfo>)
    {
        if (!info.sheduleRecord || !Id.isId(info.sheduleRecord))
            throw Error(errorImpossibleUpdateRecord.noSheduleInfo);

        let endTime: Date = new Date(info.dateTime.getTime())
        endTime.setUTCHours(info.dateTime.getUTCHours() + info.duration);

        if (this._compare_days(info.dateTime, endTime))
            throw Error(errorImpossibleCreateTimeTableRecord.theEndDateIsNextDay);

        let nextDay: Date = new Date(info.dateTime.getTime());
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        let shedulered = await this._shedularRepository.search({id: info.sheduleRecord});

        if (info.dateTime.getUTCDay() + 1 !== shedulered[0].day)
            throw Error(errorImpossibleCreateTimeTableRecord.notSameDayweek)

        if (this._compare_day_times(endTime, shedulered[0].timeEnd) > 0  || 
            this._compare_day_times(info.dateTime, shedulered[0].timeStart) < 0)
            throw Error(errorImpossibleCreateTimeTableRecord.durationMoreShedularEnd);

        let otherRecords = await this._timeTableRecordRepository.searchDatePeriod({sheduleRecord: info.sheduleRecord}, 
            this._get_only_date(info.dateTime), this._get_only_date(nextDay)
        );

        otherRecords.forEach((record) => {
            let endRec = new Date(record.dateTime.getTime());
            endRec.setUTCHours(record.dateTime.getUTCHours() + record.duration);

            if (
                this._compare_day_times(record.dateTime, info.dateTime) <= 0 && this._compare_day_times(endRec, info.dateTime) > 0 ||
                this._compare_day_times(record.dateTime, endTime) < 0 && this._compare_day_times(endRec, endTime) >= 0
            )
                throw Error(errorImpossibleCreateTimeTableRecord.sameRecords);
        });
    }

    constructor() 
    {
        super();
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._clientRepository = container.resolve(ClientRepositoryName);
        this._shedularRepository = container.resolve(SheduleRecordRepositoryName);
        this._timeTableRecordRepository = container.resolve(TimeTableRecordRepositoryName);
        this._applicationRepository = container.resolve(ApplicationRepositoryName);
        this._carRepository = container.resolve(CarRepositoryName);
    }

    async create(info: NotRequireID<ApplicationInfo>, 
                 initiator: ClientInfo | MechanicInfo): Promise<undefined>
    {
        if (initiator.type == UserRoles.client)
            await this._validate_existing_user(initiator.id, this._clientRepository.search);
        else
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);

        await setCreatedStatus(info);

        await this._applicationRepository.create(info);
    }

    private async _validate_mechanic_required_fields(info: ApplicationInfo, initiator: MechanicInfo | AdminInfo)
    {
        let count: number = 0;
        for (const key in info)
        {
            if (info[key] != 'id' && info[key] != 'mechanicComment' && info[key] !== undefined)
                throw Error(errorDataAccess.impossibleAccess);
            else if (info[key] === 'id' || info[key] === 'mechanicComment')
                count++;
        }

        if (count !== 2)
            throw Error(errorDataAccess.impossibleAccess);
    }

    async update(info: ApplicationInfo, initiator: MechanicInfo | AdminInfo): Promise<undefined>
    {
        if (initiator.type == UserRoles.mechanic)
        {
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);
            await this._validate_mechanic_required_fields(info, initiator);
        }
        else
            await this._validate_existing_user(initiator.id, this._adminRepository.search);

        if (!(await this._validate_existing_application(info)))
            throw Error(errorApplicationExisting.applicationExists);

        let actualyRec: ApplicationInfo[] = await this._applicationRepository.search({id: info.id});

        let timetableflag = info.timeRecord !== undefined && actualyRec.length && info.timeRecord.dateTime && 
        (this._compare_days(info.timeRecord.dateTime, actualyRec[0].timeRecord.dateTime) || 
        this._compare_day_times(info.timeRecord.dateTime, actualyRec[0].timeRecord.dateTime));

        if (timetableflag || info.timeRecord !== undefined && actualyRec.length && (
            info.timeRecord.sheduleRecord && !info.timeRecord.sheduleRecord.isEqual(actualyRec[0].timeRecord.sheduleRecord)
            ))
        {
            await this._validate_timerecord_info(info.timeRecord);
            await setSavedStatus(info);

            if (actualyRec[0].timeRecord !== undefined)
                await this._timeTableRecordRepository.update(info.timeRecord);
        }

        await this._applicationRepository.update(info);
    }

    private async _validate_car_owner(info: Partial<ApplicationInfo>, initiator:  AdminInfo | MechanicInfo | ClientInfo)
    {
        if (info.car === undefined)
            throw Error(errorDataAccess.impossibleAccess);

        let car: CarInfo[] = await this._carRepository.search({VIN: info.car});

        if (!car[0].owner.isEqual(initiator.id))
            throw Error(errorDataAccess.impossibleAccess);
    }

    async search(info:  Partial<ApplicationInfo>, 
                                    initiator: AdminInfo | MechanicInfo | ClientInfo,
                                    pass?: number, count?: number): Promise<ApplicationInfo []>
    {
        if (initiator.type == UserRoles.admin)
            await this._validate_existing_user(initiator.id, this._adminRepository.search);
        else if (initiator.type == UserRoles.mechanic)
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);
        else
        {
            await this._validate_existing_user(initiator.id, this._clientRepository.search);
            await this._validate_car_owner(info, initiator);
        }

        const foundedData: ApplicationInfo [] = await this._applicationRepository.search(info, pass, count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<ApplicationInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._applicationRepository.getListOfAll(pass, count);

        return result;
    }
}