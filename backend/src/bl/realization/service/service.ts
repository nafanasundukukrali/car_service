import { container, injectable } from "tsyringe";
import { IServiceRepository } from "@asinterfaces/repository/IServiceRepository.interface";
import { ServiceInfo } from "@astypes/serviceinfo/serviceinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { IClientRepository } from "@asinterfaces/repository/IClientRepository.interface";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { RealizationBase } from "../realizationbase";
import { IService } from "@asinterfaces/realization/IService.interface"
import { AdminRepositoryName, ClientRepositoryName, MechanicRepositoryName, ServiceRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { PositiveInteger } from "@astypes/positiveinteger"
import Logger from "@logger/logger";

@injectable()
export class Service extends RealizationBase implements IService
{
    private _serviceRepository: IServiceRepository;
    private _adminRepository: IAdminRepository;
    private _clientRepository: IClientRepository;
    private _mechanicRepository: IMechanicRepository;

    constructor() 
    {
        super();
        this._serviceRepository = container.resolve(ServiceRepositoryName);
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._clientRepository = container.resolve(ClientRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
    }

    async search(info:  Partial<ServiceInfo>, initiator: AdminInfo | ClientInfo | MechanicInfo | undefined,
                                    pass?: number, count?: number): Promise<undefined | ServiceInfo []>
    {
        Logger.info("Search service information user id", initiator);

        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            case UserRoles.client:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
            default:
                await this._validate_existing_user(initiator.id, this._mechanicRepository.search);
                break;
        }

        let res = await this._serviceRepository.search(info, pass, count);

        return res;
    }

    async getListOfAll(initiator: AdminInfo | ClientInfo | MechanicInfo | undefined, pass?: PositiveInteger, count?: PositiveInteger): Promise<ServiceInfo[]>
    {
        Logger.info("Get list of all services user by id = ", initiator.id.getStringVersion());

        let result: ServiceInfo[];
        result = await this._serviceRepository.getListOfAll(pass, count);        
        return result;
    }
}