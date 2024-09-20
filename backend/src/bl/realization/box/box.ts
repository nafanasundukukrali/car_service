import { container, injectable } from "tsyringe";
import { IBoxRepository } from "@asinterfaces/repository/IBoxRepository,interface";
import { BoxInfo } from "@astypes/boxinfo/boxinfo";
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { IAdminRepository } from "@asinterfaces/repository/IAdminRepository.interface";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { IClientRepository } from "@asinterfaces/repository/IClientRepository.interface";
import { AdminRepositoryName, BoxRepositoryName, ClientRepositoryName, MechanicRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { RealizationBase } from "../realizationbase";
import { IBox } from "@asinterfaces/realization/IBox.interface";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { PositiveInteger } from "@astypes/positiveinteger"

@injectable()
export class Box extends RealizationBase implements IBox
{
    private _boxRepository: IBoxRepository;
    private _adminRepository: IAdminRepository;
    private _clientRepository: IClientRepository;
    private _mechanicRepository: IMechanicRepository;

    constructor() 
    {
        super();
        this._boxRepository = container.resolve(BoxRepositoryName);
        this._adminRepository = container.resolve(AdminRepositoryName);
        this._clientRepository = container.resolve(ClientRepositoryName);
        this._mechanicRepository = container.resolve(MechanicRepositoryName);
    }

    async search(info:  Partial<BoxInfo>, 
                                    initiator: AdminInfo | ClientInfo | MechanicInfo,
                                    pass?: number, count?: number): Promise<BoxInfo []>
    {
        switch (initiator.type) 
        {
            case UserRoles.admin:
                await this._validate_existing_user(initiator.id, this._adminRepository.search);
                break;
            case UserRoles.mechanic:
                await this._validate_existing_user(initiator.id, this._mechanicRepository.search);
                break;
            default:
                await this._validate_existing_user(initiator.id, this._clientRepository.search);
                break;
         }

        const foundedData: BoxInfo [] = await this._boxRepository.search(info, pass, count);

        return foundedData;
    }

    async getListOfAll(initiator: AdminInfo, pass?: PositiveInteger, count?: PositiveInteger): Promise<BoxInfo[]>
    {
        await this._validate_existing_user(initiator.id, this._adminRepository.search);

        let result = await this._boxRepository.getListOfAll(pass, count);

        return result;
    }
}