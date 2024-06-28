import { container, injectable } from "tsyringe";
import { IServiceRepository } from "@//bl/interfaces/repository/IServiceRepository.interface";
import { ServiceInfo } from "@bltypes/serviceinfo/serviceinfo";
import { AdminInfo } from "@bltypes/admininfo/admininfo";
import { IAdminRepository } from "@//bl/interfaces/repository/IAdminRepository.interface";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";
import { IClientRepository } from "@//bl/interfaces/repository/IClientRepository.interface";
import { IMechanicRepository } from "@//bl/interfaces/repository/IMechanicRepository.interface";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { RealizationBase } from "../realizationbase";
import { IService } from "@blinterfaces/realization/IService.interface"
import { AdminRepositoryName, ClientRepositoryName, MechanicRepositoryName, ServiceRepositoryName } from "../../interfaces/repository/interfacesnames";
import { PositiveInteger } from "@bltypes/positiveinteger"

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

        const foundedData: undefined | ServiceInfo [] = await this._serviceRepository.search(info, pass, count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo | ClientInfo | MechanicInfo | undefined, pass?: PositiveInteger, count?: PositiveInteger): Promise<ServiceInfo[]>
    {
        let result: ServiceInfo[];
        result = await this._serviceRepository.getListOfAll(pass, count);        
        return result;
    }
}