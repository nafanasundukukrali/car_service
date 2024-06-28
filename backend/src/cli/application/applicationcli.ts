import "reflect-metadata";
import { IClient } from '@blinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@blinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@blinterfaces/realization/IMechanic.interface';
import Auth from '@blrealization/auth/auth';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { Id } from '@bltypes/id/id';
import { container } from "tsyringe";
import { AdminName, ApplicationName, CarName, ClientName, MechanicName, ServiceName } from "@blinterfaces/realization/interfacesnames";
import { AdminInfo } from '@bltypes/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { NotRequireID } from '@bltypes/helperpath/helpertypes';
import { ICar } from "@blinterfaces/realization/ICar.interface";
import { Table } from 'console-table-printer';
import { CarInfo } from "@bltypes/carinfo/carinfo";
import { IApplication } from "@blinterfaces/realization/IApplication.interface";
import { ApplicationInfo } from "@//bl/types/applicationinfo/applicationinfo";
import { ServiceInfo } from "@//bl/types/serviceinfo/serviceinfo";
import { IService } from "@//bl/interfaces/realization/IService.interface";
import { BaseStatus } from "@//bl/types/basestatus/basestatus";
import { ApplicationStatus, ApplicationStatusType } from "@//bl/types/applicationstatus/applicationstatus";
import { MechanicInfo } from "@//bl/types/mechanicinfo/mechanicinfo";
import CarCLI from "../car/carcli";

export default class ApplicationCLI {
    private _input: Input;
    private _client: IClient;
    private _admin: IAdmin;
    private _mechanic: IMechanic;
    private _auth: Auth;
    private _application: IApplication
    private _lm: ILanguageModel;
    private _service_list: ServiceInfo[] = [];
    private _service: IService
    private _car: ICar;
    private _carCLI: CarCLI;

    constructor () {
        this._mechanic = container.resolve(MechanicName);
        this._client = container.resolve(ClientName);
        this._admin = container.resolve(AdminName);
        this._lm = container.resolve(LanguageModel);
        this._car = container.resolve(CarName);
        this._carCLI = new CarCLI()
        this._application = container.resolve(ApplicationName)
        this._service = container.resolve(ServiceName)
        this._input = new Input();
        this._auth = new Auth();
    }

    private _get_status_string(applStat: ApplicationStatus)
    {
        if (applStat == BaseStatus.stored)
            return this._lm.saved;
        if (applStat == ApplicationStatusType.closed)
            return this._lm.closed;
        if (applStat == ApplicationStatusType.created)
            return this._lm.createdStatus
        else
            return this._lm.dirty
    }

    async print_client_applications(initiator: ClientInfo)
    {
        if (this._service_list.length === 0)
            this._service_list = await this._service.getListOfAll(initiator);

        let cars: CarInfo[] = await this._car.search({owner: initiator.id}, initiator); 
        let applications: ApplicationInfo[] = [];
        let servicesNames: string[] = [];
        let carsNicks: string [] = [];
        for (let i = 0; i < cars.length; i++)
        {
            let appls: ApplicationInfo[] = await this._application.search({car: cars[i].VIN}, initiator)

            appls.forEach((value) => {
                applications.push(value);
                let service = this._service_list.filter((serv) => serv.id.isEqual(value.service));
                servicesNames.push(this._service_list.filter((serv) => serv.id.isEqual(value.service))[0].name)
                let nick: string = cars.filter((val) => val.VIN === value.car)[0].nick;
                carsNicks.push(nick)
            } )
        }

        if (applications.length === 0)
        {
            console.log(this._lm.noApplicationRecord);
            return;
        }

        const p = new Table({
            columns: [
                {name: '#'},
                { name: 'c1', title: this._lm.carNick }, 
                { name: 'c2', title: this._lm.carVIN }, 
                { name: 'c3', title: this._lm.date },
                { name: 'c4', title: this._lm.serviceName },
                { name: 'c5', title: this._lm.status },
                ],
        });

        for (let i = 0; i < applications.length; i++)
        {
            let status: string;
            
            p.addRow({'#': i + 1, c1: carsNicks[i], c2: applications[i].car, 
                        c3: applications[i].timeRecord && applications[i].timeRecord.dateTime ? applications[i].timeRecord.dateTime.toLocaleDateString() : '-', c4: servicesNames[i], 
                        c5: this._get_status_string(applications[i].status)})
        }

        p.printTable();
    }

    async create_application(initiator: ClientInfo | MechanicInfo)
    {
        let search_user: ClientInfo; 

        if (initiator.type === UserRoles.mechanic)
        {
            //todo
        }
        else 
            search_user = initiator;

        while (true)
        {
            if (this._service_list.length === 0)
                this._service_list = await this._service.getListOfAll(search_user);

            const p = new Table({
                columns: [
                    {name: '#'},
                    { name: 'c2', title: this._lm.serviceName },
                    ],
            });
    
            for (let i = 0; i < this._service_list.length; i++)
                p.addRow({'#': i + 1, c1: this._service_list[i].name})
    
            p.printTable();

            let i: any = NaN;

            while (isNaN(i))
            {
                i = await this._input.wait_input_positive_integer(this._lm.inputServiceNumber, this._lm.outUpdateCarQuestion);
                if (i === undefined)
                    return;
                if (i > this._service_list.length)
                {
                    console.log(this._lm.inputIncorrect);
                    i = NaN;

                    let out = await this._input.askQuestion(this._lm.outUpdateCarQuestion);

                    if (out === this._lm.yes)
                        return;
                }
            }

            let carinf: CarInfo | undefined = await this._carCLI.get_car_number(search_user, this._lm.outCreateApplication);

            if (carinf === undefined)
                return;

            try {
                await this._application.create({car: carinf.VIN, service: this._service_list[i - 1].id, }, initiator)
                return;
            } 
            catch (error) {console.log(error.message)};

            console.log(this._lm.inputIncorrect);
            let out = await this._input.askQuestion(this._lm.outAddCarQuestion);

            if (out === this._lm.yes) return;
        }
    }
}