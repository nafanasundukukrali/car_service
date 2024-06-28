import { container, injectable } from "tsyringe";
import { IApplicationRepository } from "@//bl/interfaces/repository/IApplicationRepository.interface";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { IMechanicRepository } from "@//bl/interfaces/repository/IMechanicRepository.interface";
import { IAdminRepository } from "@//bl/interfaces/repository/IAdminRepository.interface";
import {  errorDataAccess, errorUserInDb } from "@blerrors/user/usererrors";
import { ITimeTableRecordRepository } from "@//bl/interfaces/repository/ITimeTableRecordRepository.interface";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { ISheduleRecordRepository } from "@//bl/interfaces/repository/ISheduleRecordRepository.interface";
import { setAchivedStatus, setSavedStatus } from "../changeachivedstatus/changeachivedstatus";
import { SheduleRecordInfo } from "@bltypes/shedulerecordinfo/shedulerecordinfo";
import { isClosed, setDirtyStatus } from "../applicationstatus/applicationstatus";
import { errorEmail } from "@blerrors/user/usererrors";
import { AdminRepositoryName, ApplicationRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName } from "@//bl/interfaces/repository/interfacesnames";
import { RealizationBase } from "../realizationbase";
import { IMechanic } from "@blinterfaces/realization/IMechanic.interface";
import { UserRoles } from "../../types/userinfo/userinfo";
import { PositiveInteger } from "@bltypes/positiveinteger"

@injectable()
export class Mechanic extends RealizationBase implements IMechanic
{
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;
    private _timeTableRecordRepository: ITimeTableRecordRepository;
    private _applicationRepository: IApplicationRepository;
    private _shedularRepository: ISheduleRecordRepository;

    private async _validate_existing_mechanic(info: Partial<MechanicInfo>)
    {
        let arr: MechanicInfo[] = await this._mechanicRepository.search(info);

        return arr.length >= 1;
    }

    private _validate_email(email: string): any
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!expression.test(email))
            throw Error(errorEmail.inccorrect);
    }

    constructor() 
    {
        super();
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._shedularRepository = container.resolve(SheduleRecordRepositoryName);
        this._applicationRepository = container.resolve(ApplicationRepositoryName);
        this._timeTableRecordRepository = container.resolve(TimeTableRecordRepositoryName);
    }

    async create(info: NotRequireID<MechanicInfo>, 
                 initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        
        if (await this._validate_existing_mechanic(info))
            throw Error(errorUserInDb.userExist);

        this._validate_email(info.email);

        await setSavedStatus(info);

        await this._mechanicRepository.create(info);
    }

    async update(info: MechanicInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        
        if (!(await this._validate_existing_mechanic(info)))
            throw Error(errorUserInDb.userNotExist);

        if (info.email !== undefined)
            this._validate_email(info.email);

        if (info.status !== undefined)
            throw Error(errorDataAccess.impossibleAccess);

        this._mechanicRepository.update(info);
    }

    private async _validate_existind_recordds_of_achived_mechanic(info)
    {
        let sheduleRecords: SheduleRecordInfo[] = await this._shedularRepository.search({mechanic: info.id});
        let updateArr = [];

        for (let value of sheduleRecords)
        {
            let timrecords = await this._timeTableRecordRepository.search({id: value.id});

            for (let rec of timrecords)
            {
                let application = await this._applicationRepository.search({timeRecord: rec});
                if (!(await isClosed(application[0])))
                {
                    await setDirtyStatus(application[0]);
                    updateArr.push(application[0]);
                }
            }
        }

        await this._applicationRepository.updateByOneTransaction(updateArr);
    }

    async archive(info: MechanicInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        await this._validate_existind_recordds_of_achived_mechanic(info);

        await setAchivedStatus(info);
        await this._mechanicRepository.update(info);
    }

    async unarchive(info: MechanicInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await setSavedStatus(info);
        await this._mechanicRepository.update(info);
    }

    async search(info:  Partial<MechanicInfo>, 
                                    initiator: AdminInfo | MechanicInfo,
                                    pass?: number, count?: number): Promise<MechanicInfo []>
    {
        if (initiator.type == UserRoles.admin)
        {
            await this._validate_existing_user(initiator.id, this._adminRepository.search);
        }
        else if (initiator.type == UserRoles.mechanic)
        {
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);
            info.id = initiator.id
        }

        const foundedData: MechanicInfo [] = await this._mechanicRepository.search(info, pass, count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<MechanicInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._mechanicRepository.getListOfAll(pass, count);

        return result;
    }
}