import { injectable } from "tsyringe";
import { IServiceRepository } from "@blinterfaces/repository/IServiceRepository.interface";
import { ServiceInfo } from "@bltypes/serviceinfo/serviceinfo";
import { Id } from "@bltypes/id/id";

@injectable()
export class BLTestService implements IServiceRepository{
    async search (info: Partial<ServiceInfo>, pass?: number, count?: number): Promise<ServiceInfo[]>
    {
        return [{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', }];
    }

    async getListOfAll(pass?: number, count?: number): Promise<ServiceInfo[]>
    {
        return [{'id': new Id('1'), name: 'some', price: 10.00, discription: 'lol', },
        {'id': new Id('2'), name: 'some', price: 10.00, discription: 'lol', }
        ];
    }
}