import { container, injectable } from "tsyringe";
import { CarInfo } from "@bltypes/carinfo/carinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { errorDataAccess, errorUserInDb } from '@blerrors/user/usererrors';
import { ICarRepository } from "@blinterfaces/repository/ICarRepository.interface";
import { validateVIN } from "universal-vin-decoder";
import { errorCarInDB, errorNoVin } from "@blerrors/car/carerrors";
import { IClientRepository } from "@blinterfaces/repository/IClientRepository.interface";
import { IApplicationRepository } from "@blinterfaces/repository/IApplicationRepository.interface";
import { IAdminRepository } from "@blinterfaces/repository/IAdminRepository.interface";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { RealizationBase } from "../realizationbase";
import { ICar } from "@blinterfaces/realization/ICar.interface";
import { AdminRepositoryName, ApplicationRepositoryName, CarRepositoryName, ClientRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { PositiveInteger } from "@bltypes/positiveinteger"

@injectable()
export class Car extends RealizationBase implements ICar
{
    private _carRepository: ICarRepository;
    private _clientRepository: IClientRepository;
    private _applicationRepository: IApplicationRepository;
    private _adminRepository: IAdminRepository;

    constructor() 
    {
        super();
        this._carRepository = container.resolve(CarRepositoryName);
        this._clientRepository = container.resolve(ClientRepositoryName);
        this._applicationRepository = container.resolve(ApplicationRepositoryName);
        this._adminRepository = container.resolve(AdminRepositoryName);
    }

    private async _validate_car_existing(info: CarInfo)
    {
        let arr: CarInfo[] = [];

        if (info.VIN)
            arr = await this._carRepository.search({VIN: info.VIN});

        return arr.length >= 1;
    }

    private async _validate_VIN(vin: string)
    {
        return validateVIN(vin);
    }

    async create(info: Required<CarInfo>, initiator: AdminInfo | ClientInfo): Promise<undefined>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            default:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
         }

        if (!(await this._validate_VIN(info.VIN)))
            throw Error(errorNoVin.NoVin);

        if (!info.owner)
            throw Error(errorUserInDb.userNotExist);

        await this._validate_existing_user(info.owner, this._clientRepository.search);

        if (await this._validate_car_existing(info))
            throw Error(errorCarInDB.CarExists);

        if (initiator.type === UserRoles.client && (!info.owner || !info.owner.isEqual(initiator.id)))
            throw Error(errorDataAccess.impossibleAccess);

        await this._carRepository.create(info);
    }

    async update(info: CarInfo, initiator: AdminInfo | ClientInfo): Promise<undefined>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            default:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
        }

        if (!(await this._validate_car_existing(info)))
            throw Error(errorCarInDB.NoExists);

        if (initiator.type === UserRoles.client && (!info.owner || !info.owner.isEqual(initiator.id)))
            throw Error(errorDataAccess.impossibleAccess);

        await this._carRepository.update(info);
    }

    async drop(info: CarInfo, initiator: AdminInfo): Promise<undefined>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let applications = await this._applicationRepository.search({car: info.VIN});

        await this._applicationRepository.dropByOneTransaction(applications);

        await this._carRepository.drop(info);
    }

    async search(info:  Partial<CarInfo>, 
                                    initiator: AdminInfo | ClientInfo,
                                    pass?: number, count?: number): Promise<CarInfo []>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            default:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
        }

        const foundedData: CarInfo [] = await this._carRepository.search(info, pass, count);

        if (initiator.type == UserRoles.client)
            foundedData.filter((value) => value.owner && value.owner.isEqual(initiator.id));

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<CarInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);
        
        let result = await this._carRepository.getListOfAll(pass, count);

        return result;
    }
}

