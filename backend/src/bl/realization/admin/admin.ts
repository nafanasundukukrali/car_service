import { container, injectable } from "tsyringe";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import { errorEmail, errorUserInDb } from '@blerrors/user/usererrors';
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { AdminRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { RealizationBase } from "../realizationbase";
import { IAdmin } from "@asinterfaces/realization/IAdmin.interface";
import { PositiveInteger } from "@astypes/positiveinteger"
import Logger from "@logger/logger";

@injectable()
export class Admin extends RealizationBase implements IAdmin
{
    private _adminRepository: IAdminRepository;

    constructor() 
    {
        super();
        this._adminRepository = container.resolve(AdminRepositoryName);
    }

    private async _validate_admin_existing(info: Partial<AdminInfo>)
    {
        let arr: AdminInfo[] = await this._adminRepository.search(info);

        return arr.length >= 1;
    }

    private async _validate_email(email: string): Promise<undefined>
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!expression.test(email) || await this._adminRepository.validateEmailExisting(email))
            throw Error(errorEmail.inccorrect);
    }

    async create(info: NotRequireID<AdminInfo>, initiator: AdminInfo): Promise<undefined>
    {
        Logger.info("create new admin account");

        if (!(await this._validate_admin_existing(initiator)))
            throw Error(errorUserInDb.userNotExist);

        await this._validate_email(info.email);

        if (await this._validate_admin_existing(info))
            throw Error(errorUserInDb.userExist);

        await this._adminRepository.create(info);
    }

    async update(info: AdminInfo, initiator: AdminInfo): Promise <undefined>
    {
        Logger.info("Update admin account");

        if (!(await this._validate_admin_existing(initiator)))
            throw Error(errorUserInDb.userNotExist);

        if (info.email !== undefined)
            await this._validate_email(info.email);

        if (!(await this._validate_admin_existing(info)))
            throw Error(errorUserInDb.userNotExist);

        await this._adminRepository.update(info);
    }

    async search (info:  Partial<AdminInfo>, initiator: AdminInfo,
                                    pass?: number, count?: number): Promise<AdminInfo []>
    {
        Logger.info(`Searcg admin account, inittiator id = ${initiator.id}`);

        if (!(await this._validate_admin_existing(initiator)))
            throw Error(errorUserInDb.userNotExist);

        return await this._adminRepository.search(info, pass, count);
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<AdminInfo[]>
    {
        Logger.info('Get lsit of all admins.');
        
        if (!(await this._validate_admin_existing(initiator)))
            throw Error(errorUserInDb.userNotExist);

        return await this._adminRepository.getListOfAll(pass, count);
    }
}