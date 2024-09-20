import { container, injectable } from "tsyringe";
import { IClientRepository } from "@asinterfaces/repository/IClientRepository.interface";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import { errorDataAccess, errorDateBirth, errorEmail, errorPhone, errorUserInDb } from '@blerrors/user/usererrors';
import { MechanicInfo } from '@astypes/mechanicinfo/mechanicinfo';
import { NotRequireID} from "@astypes/helperpath/helpertypes";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { Id } from "@astypes/id/id";
import { AdminRepositoryName, ClientRepositoryName, MechanicRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { IClient } from "@asinterfaces/realization/IClient.interface";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { RealizationBase } from "../realizationbase";
import { PositiveInteger } from "@astypes/positiveinteger"

@injectable()
export class Client extends RealizationBase implements IClient
{
    private _clientRepository: IClientRepository;
    private _adminRepository: IAdminRepository;
    private _mechanicRepository: IMechanicRepository;

    private _validate_datebirth(dateBirth: Date, todayDate: Date): undefined
    {
        if (this._compare_days(dateBirth, todayDate) >= 0)
            throw Error(errorDateBirth.dateolder);

        let yearDist = todayDate.getFullYear() - dateBirth.getFullYear();

        if (yearDist < 18)
            throw Error(errorDateBirth.less18);
    }

    private async _validate_email(email: string): Promise<undefined>
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!expression.test(email) || await this._clientRepository.validateEmailExisting(email))
            throw Error(errorEmail.inccorrect);
    }

    private async _validate_phone(phone: string): Promise<undefined>
    {
        const expression: RegExp = /^[8][- ]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/i;

        if (!expression.test(phone) || await this._clientRepository.validatePhoneExisting(phone))
            throw Error(errorPhone.inccorrect);
    }

    private async _validate_client_existing(info: NotRequireID<ClientInfo>): Promise<boolean>
    {
        let arr: ClientInfo[] = await this._clientRepository.search(info);

        return arr.length >= 1;
    }

    constructor() 
    {
        super();
        this._clientRepository = container.resolve(ClientRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
        this._adminRepository = container.resolve(AdminRepositoryName);
    }

    async create(info: NotRequireID<Required<ClientInfo>>, today: Date): Promise<undefined>
    {
        await this._validate_phone(info.phone);
        await this._validate_email(info.email);
        this._validate_datebirth(info.dateBIrth, today);

        if (await this._validate_client_existing(info))
            throw Error(errorUserInDb.userExist);

        await this._clientRepository.create(info);
    }

    async update(info: ClientInfo, initiator: AdminInfo | ClientInfo, today?: Date): Promise <undefined>
    {
        if (initiator.type == UserRoles.client)
            await this._validate_existing_user(initiator.id, this._clientRepository.search);
        else 
            await this._validate_existing_user(initiator.id, this._adminRepository.search);

        if (initiator.type == UserRoles.client && !info.id.isEqual(initiator.id))
            throw Error(errorDataAccess.impossibleAccess);

        if (info.email !== undefined)
            await this._validate_email(info.email);

        if (info.phone !== undefined)
            await this._validate_phone(info.phone);

        if (info.dateBIrth !== undefined)
        {
            if (today === undefined)
                throw Error(errorDataAccess.impossibleAccess);

            this._validate_datebirth(info.dateBIrth, today);
        }

        await this._validate_existing_user(info.id, this._clientRepository.search);

        await this._clientRepository.update(info);
    }

    async search(info: Partial<ClientInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo,
                pass?: number, count?: number): Promise<ClientInfo []>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            case UserRoles.client:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
            default: 
                await this._validate_existing_user(initiator.id, this._mechanicRepository.search);;
                break;
         }

        const foundedData: ClientInfo [] = await this._clientRepository.search(info, pass, count);

        if (initiator.type === UserRoles.client && (foundedData.length !== 1 || !initiator.id.isEqual(foundedData[0].id)))
            throw Error(errorDataAccess.impossibleAccess);

        if (initiator.type == UserRoles.mechanic)
        {
            foundedData.forEach((val: ClientInfo) => {return delete val['password'];})
            return foundedData;
        }

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo | MechanicInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<ClientInfo[]>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            default: 
                await this._validate_existing_user(initiator.id, this._mechanicRepository.search);;
                break;
         }

        let result = await this._clientRepository.getListOfAll(pass, count);

        if (initiator.type == UserRoles.mechanic)
            result.forEach((val: ClientInfo) => {return delete val['password'];})

        return result;
    }
}

