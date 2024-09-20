import { container, injectable } from "tsyringe";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import {  errorDataAccess } from "@blerrors/user/usererrors";
import { ITimeTableRecordRepository } from "@asinterfaces/repository/ITimeTableRecordRepository.interface";
import { TimeTableRecordInfo } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import { Id } from "@astypes/id/id";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { RealizationBase } from "../realizationbase";
import { ITimeTableRecord } from "@asinterfaces/realization/ITimeTableRecord.interface";
import { AdminRepositoryName, MechanicRepositoryName, TimeTableRecordRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from "@astypes/positiveinteger"
import { TimeTableRecordList } from "@astypes/timetablerecordinfo/timetablerecordinfo";

@injectable()
export class TimeTableRecord extends RealizationBase implements ITimeTableRecord
{
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;
    private _timeTableRecordRepository: ITimeTableRecordRepository;

    constructor() 
    {
        super();
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._timeTableRecordRepository = container.resolve(TimeTableRecordRepositoryName);
    }

    async search(info:  NotRequireID<TimeTableRecordList>, 
                        initiator: AdminInfo | MechanicInfo,
                        pass?: number, count?: number): Promise<TimeTableRecordList []>
    {
        let search_mechanic;
        if (initiator.type == UserRoles.admin)
        {
            await this._validate_existing_user(initiator.id, this._adminRepository.search);
        }
        else if (initiator.type === UserRoles.mechanic)
        {
            await this._validate_existing_user(initiator.id, this._mechanicRepository.search);

            search_mechanic = initiator;
        }

        const foundedData: TimeTableRecordList[] = await this._timeTableRecordRepository.searchList(info, search_mechanic, pass, count=count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<TimeTableRecordList[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._timeTableRecordRepository.getListOfAll(pass, count);

        return result;
    }
}