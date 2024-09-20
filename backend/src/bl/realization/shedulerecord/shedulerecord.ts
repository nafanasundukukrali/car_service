import { container, injectable } from "tsyringe";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { ISheduleRecordRepository } from "@asinterfaces/repository/ISheduleRecordRepository.interface";
import { IBoxRepository } from "@asinterfaces/repository/IBoxRepository,interface";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { errorSheduleExisting, errorSheduleRecordDelete } from "@blerrors/shedulerecord/shedulerecorderrors";
import { errorDataAccess } from "@blerrors/user/usererrors";
import { errorBoxExisting } from "@blerrors/box/boxerrors.";
import { errorDirtyShedular } from "@blerrors/serviceerrors/serviceerrors";
import { ITimeTableRecordRepository } from "@asinterfaces/repository/ITimeTableRecordRepository.interface";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { IApplicationRepository } from "@asinterfaces/repository/IApplicationRepository.interface";
import { isClosed, isDirty, setDirtyStatus } from "@astypes/applicationstatus/applicationstatus";
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import { Id } from "@astypes/id/id";
import { BoxInfo } from "@astypes/boxinfo/boxinfo";
import { errorShedularRecordTimeValidation } from '@blerrors/shedulerecord/shedulerecorderrors';
import { AdminRepositoryName, ApplicationRepositoryName, BoxRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { RealizationBase } from "../realizationbase";
import { ISheduleRecord } from "@asinterfaces/realization/ISheduleRecord.interface";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from "@astypes/positiveinteger"
import { setAchivedStatus } from "../changeachivedstatus/changeachivedstatus";

@injectable()
export class SheduleRecord extends RealizationBase implements ISheduleRecord
{
    private _sheduleRecordRepository: ISheduleRecordRepository;
    private _boxRepository: IBoxRepository;
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;
    private _timeTableRecordRepository: ITimeTableRecordRepository;
    private _applicationRepository: IApplicationRepository;

    private async _validate_box_existing(info: Id)
    {
        let arr: BoxInfo[] = await this._boxRepository.search({id: info});

        if (arr && arr.length !== 1)
            throw Error(errorBoxExisting.boxNotExists);
    }

    private async _users_validation(initiator: Id, mechanic: Id)
    {
        if (mechanic === undefined)
            throw Error(errorDataAccess.impossibleAccess);

        await this._validate_existing_user(initiator, this._adminRepository.search);
        await this._validate_existing_user(mechanic, this._mechanicRepository.search);
    }

    private async _validate_shedulare(saving_result: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        if (saving_result.day === undefined || saving_result.timeEnd === undefined 
                || saving_result.timeStart === undefined
                || saving_result.timeEnd && saving_result.timeStart && this._compare_day_times(saving_result.timeStart, saving_result.timeEnd) >= 0)
            throw Error(errorShedularRecordTimeValidation.notEnoughInfo);

        let mechanicDayShedule: SheduleRecordInfo[] = await this._sheduleRecordRepository.search({day:saving_result.day, mechanic: saving_result.mechanic});
        mechanicDayShedule = mechanicDayShedule?.filter((value) => (saving_result.id ? value.id != saving_result.id : 1) && this._compare_day_times(value.timeStart, saving_result.timeStart) <= 0 &&
                                                        this._compare_day_times(value.timeEnd, saving_result.timeStart) > 0 ||
                                                        this._compare_day_times(value.timeStart, saving_result.timeStart) >= 0 &&
                                                        this._compare_day_times(value.timeStart, saving_result.timeEnd) < 0);
        let boxDayShedule: SheduleRecordInfo[] = await this._sheduleRecordRepository.search({day: saving_result.day, box: saving_result.box});
        boxDayShedule = boxDayShedule?.filter((value) => (saving_result.id ? value.id != saving_result.id : 1) && this._compare_day_times(value.timeStart, saving_result.timeStart) <= 0 &&
                                                this._compare_day_times(value.timeEnd, saving_result.timeStart) > 0 ||
                                                this._compare_day_times(value.timeStart, saving_result.timeStart) >= 0 &&
                                                this._compare_day_times(value.timeStart, saving_result.timeEnd) < 0);

        if (boxDayShedule && boxDayShedule.length > 0 || mechanicDayShedule && mechanicDayShedule.length > 0)
            throw Error(errorDirtyShedular.addedRecordIncorrect);
    }

    constructor() 
    {
        super();
        this._sheduleRecordRepository = container.resolve(SheduleRecordRepositoryName);
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._boxRepository = container.resolve(BoxRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._timeTableRecordRepository = container.resolve(TimeTableRecordRepositoryName);
        this._applicationRepository = container.resolve(ApplicationRepositoryName);
    }

    async create(info: NotRequireID<SheduleRecordInfo>, initiator: AdminInfo): Promise<undefined>
    {
        await this._users_validation(initiator.id, info.mechanic);
        await this._validate_box_existing(info.box);
        await this._validate_shedulare(info);

        await this._sheduleRecordRepository.create(info);
    }

    async update(info: SheduleRecordInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        let actual_info: SheduleRecordInfo[] = await this._sheduleRecordRepository.search(info);
        await this._validate_shedulare(Object.assign({}, actual_info[0], info));

        await this._sheduleRecordRepository.update(info);
    }

    async archive(info: SheduleRecordInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await setAchivedStatus(info);

        let timeTableRec = await this._timeTableRecordRepository.search({sheduleRecord: info.id});
        let array_applications: ApplicationInfo[] = []

        for (let record of timeTableRec)
        {
            let application: ApplicationInfo[] = await this._applicationRepository.search({timeRecord: record});

            for (let applic of application)
                if (!await isClosed(applic) && !await isDirty(applic))
                {
                    await setDirtyStatus(applic);
                    array_applications.push(applic);
                }
        }

        await this._applicationRepository.updateByOneTransaction(array_applications);
        await this._sheduleRecordRepository.update(info);
    }

    async search(info: Partial<SheduleRecordInfo>, initiator: AdminInfo | MechanicInfo,
                pass?: number, count?: number): Promise<SheduleRecordInfo []>
    {
        if (initiator.type == UserRoles.admin)
        {
            await this._validate_existing_user(initiator.id, this._adminRepository.search);
        }
        else
        {
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);

            info.mechanic = initiator.id;
        }

        const foundedData: SheduleRecordInfo [] = await this._sheduleRecordRepository.search(info, pass, count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<SheduleRecordInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._sheduleRecordRepository.getListOfAll(pass, count);

        return result;
    }
}