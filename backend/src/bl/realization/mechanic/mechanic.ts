import { container, injectable } from "tsyringe";
import { IApplicationRepository } from "@asinterfaces/repository/IApplicationRepository.interface";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import {  errorDataAccess, errorUserInDb } from "@blerrors/user/usererrors";
import { ITimeTableRecordRepository } from "@asinterfaces/repository/ITimeTableRecordRepository.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { ISheduleRecordRepository } from "@asinterfaces/repository/ISheduleRecordRepository.interface";
import { setAchivedStatus, setSavedStatus } from "../changeachivedstatus/changeachivedstatus";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { isClosed, setDirtyStatus } from "@astypes/applicationstatus/applicationstatus";
import { errorEmail } from "@blerrors/user/usererrors";
import { AdminRepositoryName, ApplicationRepositoryName, MechanicRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { RealizationBase } from "../realizationbase";
import { IMechanic } from "@asinterfaces/realization/IMechanic.interface";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from "@astypes/positiveinteger"
import Logger from "@logger/logger";

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
        Logger.info("Create new mechanic, asmin id = " + initiator.id);

        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        
        if (await this._validate_existing_mechanic(info))
        {
            Logger.warn("User with email " + info.email + " is existing.");
            throw Error(errorUserInDb.userExist);
        }

        this._validate_email(info.email);

        await setSavedStatus(info);

        await this._mechanicRepository.create(info);
    }

    async update(info: MechanicInfo, initiator: AdminInfo): Promise<undefined>
    {
        Logger.info("Update mechanic, mechanic id = " + info.id)
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await this._validate_existing_user(info.id, this._mechanicRepository.search);

        if (info.email !== undefined)
            this._validate_email(info.email);

        if (info.status !== undefined)
        {
            Logger.warn("Not enough info for update mechanic, impossible to do this action");
            throw Error(errorDataAccess.impossibleAccess);
        }

        this._mechanicRepository.update(info);
    }

    private async _validate_existind_recordds_of_achived_mechanic(info)
    {
        Logger.info("Validated existing ecords of archived mechanic, mechanic id = " + info.id)
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
        Logger.info("Archive mechanic, mechanic id = " + info.id)
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        await this._validate_existind_recordds_of_achived_mechanic(info);

        await setAchivedStatus(info);
        await this._mechanicRepository.update(info);
    }

    async unarchive(info: MechanicInfo, initiator: AdminInfo): Promise<undefined>
    {
        Logger.info("Unarchive mechanic, mechanic id = " + info.id)
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        await setSavedStatus(info);
        await this._mechanicRepository.update(info);
    }

    async search(info:  Partial<MechanicInfo>, 
                                    initiator: AdminInfo | MechanicInfo,
                                    pass?: number, count?: number): Promise<MechanicInfo []>
    {
        Logger.info("Search mechanic " + info)

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
        Logger.info("Get lsit of all mechanics")

        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._mechanicRepository.getListOfAll(pass, count);

        return result;
    }
}