import 'reflect-metadata';
import { IService } from '@asinterfaces/realization/IService.interface';
import { container } from 'tsyringe';
import { ServiceName} from '@asinterfaces/realization/interfacesnames';
import { ServiceInfo } from '@astypes/serviceinfo/serviceinfo';
import { Table } from 'console-table-printer';
import { LanguageModel } from '../depencecli';
import ILanguageModel from '../languagemodel/ILanguageModel.inteface';

export default class ServiceCLI {
    private _service: IService;

    _lm: ILanguageModel;

    constructor () {
        this._lm = container.resolve(LanguageModel);
        this._service = container.resolve(ServiceName);
    }

    async printPriceList(user?) 
    {
        let services: ServiceInfo[] = await this._service.getListOfAll(user);

        const p = new Table({
            columns: [
                { name: 'c1', title: this._lm.serviceName }, 
                { name: 'c2', title: this._lm.serviceDiscription }, 
                { name: 'c3', title: this._lm.servicePrice }, 
              ],
        });

        for (let i = 0; i < services.length; i++)
            p.addRow({c1: services[i].name, c2: services[i].discription, c3: services[i].price})

        p.printTable();
    }
}