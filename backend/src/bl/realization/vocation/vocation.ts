import { container, injectable } from "tsyringe";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { IVocationRepository } from "@asinterfaces/repository/IVocationRepository.interface";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { VocationInfo } from "@astypes/vocationinfo/vocationinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { errorDataAccess, errorUserInDb } from "@blerrors/user/usererrors";
import { errorVocationDrop, errorVocationExisting, errorVocationPlane } from "@blerrors/vocation/vocationerror";
import { TimeTableRecordInfo } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import { ITimeTableRecordRepository } from "@asinterfaces/repository/ITimeTableRecordRepository.interface";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { ISheduleRecordRepository } from "@asinterfaces/repository/ISheduleRecordRepository.interface";
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import { IApplicationRepository } from "@asinterfaces/repository/IApplicationRepository.interface";
import { isClosed, setDirtyStatus } from "@astypes/applicationstatus/applicationstatus";
import { setSavedStatus } from "../changeachivedstatus/changeachivedstatus";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { isInVocation, setVocation } from "../mechanicstatus/mechanicstatus";
import { AdminRepositoryName, ApplicationRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName, VocationRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { RealizationBase } from "../realizationbase";
import { IVocation } from "@asinterfaces/realization/IVocation.interface";
import { UserRoles } from "@astypes/userinfo/userinfo";

@injectable()
export class Vocation extends RealizationBase implements IVocation
{
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;
    private _vocationRepository: IVocationRepository;
    private _timeTableRecordPerository: ITimeTableRecordRepository;
    private _sheduleRecordRepository: ISheduleRecordRepository;
    private _applicationRepository: IApplicationRepository;

    constructor() 
    {
        super();
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._vocationRepository = container.resolve(VocationRepositoryName);
        this._timeTableRecordPerository = container.resolve(TimeTableRecordRepositoryName);
        this._sheduleRecordRepository = container.resolve(SheduleRecordRepositoryName);
        this._applicationRepository = container.resolve(ApplicationRepositoryName);
    }

    private async _validate_vocation_existing(info: VocationInfo)
    {
        let res: VocationInfo[] = await this._vocationRepository.search(info);

        if (res.length !== 1)
            throw Error(errorVocationExisting.vocationNotExists);
    }

    private async _validate_period_correctness(info: NotRequireID<Required<VocationInfo>>, today: Date)
    {
        if (this._compare_days(info.endDate, info.startDate) <= 0)
            throw Error(errorVocationPlane.startDateOlderEnd);

        if (this._compare_days(info.startDate, today) <= 0 && this._compare_days(today, info.endDate) <= 0)
            throw Error(errorVocationPlane.todayIsVocationDay);
    }

    private async _validate_other_mehanic_vocation_periods(info: NotRequireID<Required<VocationInfo>>)
    {
        let mechanicVocations = await this._vocationRepository.search({who: info.who});

        mechanicVocations.forEach((record) => {
            if (this._compare_days(record.startDate, info.startDate) <= 0 &&
                this._compare_days(record.endDate, info.startDate) >= 0 ||
                this._compare_days(record.startDate, info.endDate) <= 0 &&
                this._compare_days(record.endDate, info.startDate) >= 0)
                throw Error(errorVocationPlane.userInVocationInThisPeriod);
        });
    }

    private async _make_records_in_vocation_period_dirty(info)
    {
        let mechanicShedule: SheduleRecordInfo[] = await this._sheduleRecordRepository.search({mechanic: info.who});
        let updateArr = [];

        for (let recordShedule of mechanicShedule)
        {
            let TimeTableRecs: TimeTableRecordInfo[] = await this._timeTableRecordPerository.searchDatePeriod({sheduleRecord: recordShedule.id}, 
                info.startDate, info.endDate);
            for (let timerec of TimeTableRecs)
            {
                let application: ApplicationInfo[] = await this._applicationRepository.search({timeRecord: timerec});
                if (!await isClosed(application[0]))
                {
                    await setDirtyStatus(application[0]);
                    updateArr.push(application[0]);
                }
            }
        }

        await this._applicationRepository.updateByOneTransaction(updateArr);
    }

    async planeVocation(info: NotRequireID<Required<VocationInfo>>, 
        initiator: AdminInfo, today: Date): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await this._validate_existing_user(info.who, this._mechanicRepository.search);

        await this._validate_period_correctness(info, today);
        await this._validate_other_mehanic_vocation_periods(info);
        await this._make_records_in_vocation_period_dirty(info);

        await this._vocationRepository.create(info);
    }

    async dropVocation(info: Required<VocationInfo>, 
        initiator: AdminInfo, today: Date): Promise<undefined>
    {
        await this._validate_period_correctness(info, today)
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await this._validate_existing_user(info.who, this._mechanicRepository.search);
        await this._validate_vocation_existing(info);

        await this._vocationRepository.drop(info);
    }

    async search(info: Partial<VocationInfo>, initiator: AdminInfo | MechanicInfo, pass?: number, count?: number): Promise<VocationInfo []>
    {
        if (initiator.type == UserRoles.admin)
        {
            await this._validate_existing_user(initiator.id, this._adminRepository.search);
        }
        else 
        {
            await this._validate_existing_user(info.who, this._mechanicRepository.search);

            if (!info.who || !info.who.isEqual(initiator.id))
                throw Error(errorDataAccess.impossibleAccess);
        }

        return await this._vocationRepository.search(info, pass, count);
    }

    async getListOfAll( initiator: AdminInfo, pass?: number, count?: number): Promise<VocationInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        return await this._vocationRepository.getListOfAll(pass, count);
    }

    private async _send_to_vocation(today: Date)
    {
        let vocationStartRecords: VocationInfo[] = await this._vocationRepository.search({startDate: today});
        let updateList = [];

        for (let record of vocationStartRecords)
        {
            let mechanics: MechanicInfo[] = await this._mechanicRepository.search({id: record.who});

            for (let mechanic of mechanics)
            {
                await setVocation(mechanic);
                updateList.push(mechanic);
            }
        }

        await this._mechanicRepository.updateByOneTransaction(updateList);
    }

    private async _return_from_vocation(today: Date)
    {
        let vocationEndRecords: VocationInfo[] = await this._vocationRepository.search({endDate:today});
        let updateList = [];

        for (let record of vocationEndRecords)
        {
            let mechanics: MechanicInfo[] = await this._mechanicRepository.search({id: record.who});

            for (let mechanic of mechanics)
            {
                if (await isInVocation(mechanic))
                {
                    await setSavedStatus(mechanic);
                    updateList.push(mechanic);
                }
            }
        }

        await this._mechanicRepository.updateByOneTransaction(updateList);
    }

    async validateTodayVocation(today: Date): Promise<undefined>
    {
        await this._send_to_vocation(today);
        await this._return_from_vocation(today);
    }
}