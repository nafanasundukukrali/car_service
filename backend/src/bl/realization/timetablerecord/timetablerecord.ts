import { container, injectable } from "tsyringe";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { IMechanicRepository } from "@//bl/interfaces/repository/IMechanicRepository.interface";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { IAdminRepository } from "@//bl/interfaces/repository/IAdminRepository.interface";
import {  errorDataAccess } from "@blerrors/user/usererrors";
import { ITimeTableRecordRepository } from "@//bl/interfaces/repository/ITimeTableRecordRepository.interface";
import { TimeTableRecordInfo } from "@bltypes/timetablerecordinfo/timetablerecordinfo";
import { Id } from "@bltypes/id/id";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { RealizationBase } from "../realizationbase";
import { ITimeTableRecord } from "@blinterfaces/realization/ITimeTableRecord.interface";
import { AdminRepositoryName, MechanicRepositoryName, TimeTableRecordRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { UserRoles } from "../../types/userinfo/userinfo";
import { PositiveInteger } from "@bltypes/positiveinteger"
import { TimeTableRecordList } from "@bltypes/timetablerecordinfo/timetablerecordinfo";

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