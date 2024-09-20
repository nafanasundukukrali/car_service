import "reflect-metadata";
import { IClient } from '@asinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@asinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@asinterfaces/realization/IMechanic.interface';
import Auth from '../auth/auth';
import { UserRoles } from '@astypes/userinfo/userinfo';
import { container } from "tsyringe";
import { AdminName, CarName, ClientName, MechanicName } from "@asinterfaces/realization/interfacesnames";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { PositiveInteger, createPositiveInteger } from '@astypes/positiveinteger';
import { Table } from 'console-table-printer';
import { CarInfo } from "@astypes/carinfo/carinfo";
import { ICar } from "@asinterfaces/realization/ICar.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import CarCLI from "../car/carcli";
import UserCLI from "../user/usercli";
import MechanicCLI from "../mechanic/mechanicli";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { AchivedStatusType } from "@astypes/achivedstatus/achivedstatus";
import ApplicationCLI from "../application/applicationcli";
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import Logger from "@logger/logger";

export default class AdminCLI {
    private _input: Input;
    private _client: IClient;
    private _car: ICar;
    private _admin: IAdmin;
    private _applicationCLI: ApplicationCLI;
    private _mechanic: IMechanic;
    private _auth: Auth;
    private _lm: ILanguageModel;
    private _PRINT_PAUSE: PositiveInteger = createPositiveInteger(10);
    private _carCLI: CarCLI;
    private _userCLI: UserCLI;
    private _mechanicCLI: MechanicCLI;

    constructor () {
        this._mechanic = container.resolve(MechanicName);
        this._client = container.resolve(ClientName);
        this._admin = container.resolve(AdminName);
        this._mechanic = container.resolve(MechanicName);
        this._lm = container.resolve(LanguageModel);
        this._car = container.resolve(CarName)
        this._input = new Input();
        this._auth = new Auth();
        this._mechanicCLI = new MechanicCLI(this._applicationCLI);
        this._carCLI = new CarCLI();
        this._userCLI = new UserCLI();
        this._applicationCLI = new ApplicationCLI();
    }

    private _validate_phone(phone: string): Boolean
    {
        const expression: RegExp = /^[8][- ]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/i;

        return expression.test(phone);
    }

    private _validate_email(phone: string): Boolean
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        return expression.test(phone);
    }

    private async _print_mechanic_list(initiator: AdminInfo)
    {
        Logger.info("Print mechanic list in table");

        let info: MechanicInfo[];
        let count: PositiveInteger = createPositiveInteger(0);
        
        while ((info = await this._mechanic.getListOfAll(initiator, createPositiveInteger(count), this._PRINT_PAUSE)) &&
                info.length > 0)
        {
            const p = new Table({
                columns: [
                    {name: '#'},
                    { name: 'c1', title: this._lm.userColumnEmail }, 
                    { name: 'c2', title: this._lm.userColumnName }
                    ],
            });
        
            for (let i = 0; i < info.length; i++)
            {
                count = createPositiveInteger(count + 1)
                p.addRow({'#': count, c1: info[i].email, c2: info[i].fio})
            }
        
            p.printTable();

            let result: string;

            while ((result = await this._input.askQuestion(this._lm.userColumnAskAction)) != "0" && result != "1")
                console.log(this._lm.incorrectInput);

            if (result == '0')
                return;
        }

        console.log(this._lm.clientLastInTable);
    }


    private async _print_clients_list(initiator: AdminInfo)
    {
        Logger.info("Print client list in table");

        let info: ClientInfo[];
        let count: PositiveInteger = createPositiveInteger(0);
        
        while ((info = await this._client.getListOfAll(initiator, createPositiveInteger(count), this._PRINT_PAUSE)) &&
                info.length > 0)
        {
            const p = new Table({
                columns: [
                    {name: '#'},
                    { name: 'c1', title: this._lm.userColumnEmail }, 
                    { name: 'c2', title: this._lm.userColumnName }, 
                    { name: 'c3', title: this._lm.userColumnPhone }
                    ],
            });
        
            for (let i = 0; i < info.length; i++)
            {
                count = createPositiveInteger(count + 1)
                p.addRow({'#': count, c1: info[i].email, c2: info[i].fio, c3: info[i].phone})
            }
        
            p.printTable();

            let result: string;

            while ((result = await this._input.askQuestion(this._lm.userColumnAskAction)) != "0" && result != "1")
                console.log(this._lm.incorrectInput);

            if (result == '0')
                return;
        }

        console.log(this._lm.clientLastInTable);
    }

    private async _search_client_by_email(initiator: AdminInfo)
    {
        Logger.info("Search client by email");

        let seacrh_email = await this._input.askQuestion(this._lm.askEmail);

        if (!this._validate_email(seacrh_email))
        {
            Logger.warn("Not existing email" + seacrh_email);
            console.log(this._lm.errorIncorrectEmail);

            return;
        }

        await this._print_client_info(initiator, seacrh_email);
    }

    private async _search_mechanic_by_email(initiator: AdminInfo)
    {
        Logger.info("Search mechanic by email");

        let seacrh_email = await this._input.askQuestion(this._lm.askEmail);

        if (!this._validate_email(seacrh_email))
        {
            Logger.warn("Not existing email" + seacrh_email);
            console.log(this._lm.errorIncorrectEmail);

            return;
        }

        await this._print_mechanic_info(initiator, seacrh_email);
    }

    private async _search_client_by_phone(initiator: AdminInfo)
    {
        Logger.info("Search client by phone");

        let seacrh_phone = await this._input.askQuestion(this._lm.askPhone);

        if (!this._validate_phone(seacrh_phone))
        {
            Logger.warn("Incorrect phone format " + seacrh_phone);
            console.log(this._lm.errorIncorrectEmail);

            return;
        }

        await this._print_client_info(initiator, undefined, seacrh_phone);
    }

    private async _work_with_one_application(application: ApplicationInfo, initiator: AdminInfo)
    {
        Logger.info("Work wih one application menu");

        while (true)
        {
            let result: string = await this._input.askQuestion(this._lm.applicationMenuForAdmin);

            if (result == '0')
            {
                return;  
            }
            else if (result == '1')
            {
                await this._applicationCLI.print_full_application_info(application, initiator);
            }
            else if (result == '2')
            {
                let mechanic: MechanicInfo = await this._applicationCLI.get_application_mechanic_info(application, initiator);
                await this._print_mechanic_info_by_result(initiator, mechanic);
                await this._process_mechanic_menu(initiator, mechanic);
            }
            else if (result == '3')
            {
                await this._applicationCLI.update_application_admin(application, initiator);
            }
            else 
            {
                console.log(this._lm.incorrectInput);
            }
        }
    }

    private async _application_menu_work(applications: ApplicationInfo[], initiator: AdminInfo)
    {
        while (true)
        {
            let result: string = await this._input.askQuestion(this._lm.applicationsMenuForAdmin);

            if (result == '0')
            {
                return;  
            }
            else if (result == '1')
            {
                let value = await this._input.wait_number_from_1_to_n(applications.length, this._lm.askInputApplicationNumber, this._lm.incorrectInput);
                await this._work_with_one_application(applications[Number(value) - 1], initiator);
            }

            console.log(this._lm.incorrectInput);
        }
    }

    private async _work_with_applications_by_client(info: ClientInfo, initiator: AdminInfo)
    {
        while (true)
        {
            let answer = await this._input.askQuestion(this._lm.askIfUserNeedDataInfo);

            if (answer == this._lm.yes || answer == this._lm.no)
            {
                let applications = await this._applicationCLI.print_client_applications(info, answer == this._lm.yes);

                if (applications.length)
                    await this._application_menu_work(applications, initiator);

                return;
            }

            console.log(this._lm.incorrectInput);
        }
    }

    async _process_client_menu(initiator: AdminInfo, info: ClientInfo)
    {
        while (true)
        {
            let result: string = await this._input.askQuestion(this._lm.clientMenuForAdmin);

            if (result == '0')
            {
                return;  
            }
            else if (result == '1')
            {
                info = await this._client.search({id: info.id}, initiator)[0];
                await this._print_client_info_by_result(initiator, info);
            }
            else if (result == '2')
            {
                await this._userCLI.client_update_info(initiator, info, false);
                info = await this._client.search({id: info.id}, initiator)[0];
            }
            else if (result == '3')
            {
                await this._carCLI.updateCarList(initiator, info);
            }
            else if (result == '4')
            {
                await this._work_with_applications_by_client(info, initiator);
            }
            else
            {
                console.log(this._lm.incorrectInput);
            }
        }
    }


    async _process_mechanic_menu(initiator: AdminInfo, info: MechanicInfo)
    {
        while (true)
        {
            let result: string = await this._input.askQuestion(this._lm.mechanicMenuForAdmin);

            if (result == '0')
            {
                return;  
            }
            else if (result == '1')
            {
                await this._print_mechanic_info_by_result(initiator, info);
            }
            else if (result == '2')
            {
                await this._mechanicCLI.mechanic_update_info(initiator, info);
                let info_1 = await this._mechanic.search({id: info.id}, initiator);
                info = info_1[0];
            }
            else if (result == '3')
            {
                await this._mechanicCLI.work_with_mechanic_vocations(initiator, info);
            }
            else if (result == '5')
            {
                await this._applicationCLI.print_mechanic_applications(info);
            }
            // else if (result == '2')
            //     await this._carCLI.updateCarList(initiator, info);
            // else
            //     console.log(this._lm.incorrectInput);
        }
    }

    async _print_client_info_by_result(initiator: AdminInfo, info: ClientInfo)
    {
        console.log(this._lm.userFIO + " " + info.fio)
        console.log(this._lm.userDatebirth + " " + info.dateBIrth)
        console.log(this._lm.userEmail + " " + info.email)
        console.log(this._lm.userPhone + " " + info.phone)
        await this._carCLI.print_car_list(initiator, info);
        await this._process_client_menu(initiator, info);
    }

    async _print_mechanic_info_by_result(initiator: AdminInfo, info: MechanicInfo)
    {
        console.log(this._lm.userFIO + " " + info.fio)
        console.log(this._lm.userEmail + " " + info.email)
        
        if (info.status == BaseStatus.stored)
            console.log(this._lm.userStatusField + " " + this._lm.userStatusStored)
        else if (info.status == AchivedStatusType.archived)
            console.log(this._lm.userStatusField + " " + this._lm.userStatusArchived)
        else
            console.log(this._lm.userStatusField + " " + this._lm.userStatusVocation)
    }

    async _print_client_info(initiator: AdminInfo, email?: string, phone?:string)
    {
        let info: ClientInfo [] = await this._client.search({email: email, phone: phone}, initiator);
        let carInfo: CarInfo[];

        if (info.length == 0)
            console.log(this._lm.userGetInfoZero);
        else if (info.length == 1)
            await this._print_client_info_by_result(initiator, info[0]);
        else
            console.log(this._lm.userGetInfoMoreTahnOne);
    }

    async _print_mechanic_info(initiator: AdminInfo, email?: string)
    {
        let info: MechanicInfo [] = await this._mechanic.search({email: email}, initiator);

        if (info.length == 0)
            console.log(this._lm.userGetInfoZero);
        if (info.length == 1)
        {
            await this._print_mechanic_info_by_result(initiator, info[0]);
            await this._process_mechanic_menu(initiator, info[0]);
        }
        else
        {
            console.log(this._lm.userGetInfoMoreTahnOne);
        }
    }

    async work_with_clients(initiator: AdminInfo)
    {
        while (true)
        {
            let result = await this._input.askQuestion(this._lm.adminClientMenu);
            
            if (result == '0')
                return;
            else if (result == '1')
                await this._print_clients_list(initiator);
            else if (result == '2')
                await this._search_client_by_email(initiator);
            else if (result == '3')
                await this._search_client_by_phone(initiator);
            else if (result == '4')
                await this.registration();
            else
                console.log(this._lm.incorrectInput);
        }
    }

    async work_with_mechanics(initiator: AdminInfo)
    {
        while (true)
        {
            let result = await this._input.askQuestion(this._lm.adminMechanicMenu);
            
            if (result == '0')
                return;
            else if (result == '1')
                await this._print_mechanic_list(initiator);
            else if (result == '2')
                await this._search_mechanic_by_email(initiator);
            // else if (result == '3')
            //     await this._search_client_by_phone(initiator);
            // else if (result == '4')
            //     await this.registration();
            else
                console.log(this._lm.incorrectInput);
        }
    }

    async client_update_info(initiator: ClientInfo | AdminInfo, chanclient ?: ClientInfo) {
        while (true)
        {
            let user: ClientInfo = {...await this._registration_data(), id: initiator.id};
            
            if (user.password)
                await this._auth.hashPassword(user);

            try {
                if (initiator.type == UserRoles.admin)
                    user.id = chanclient.id;
                
                    await this._client.update(user, initiator, new Date());
                return;
            }
            catch (error) { console.log(error.message) }

            let out = await this._input.askQuestion(this._lm.outRegQuestion)
                if (out === this._lm.yes)
                    return;
        }
    }  

    private async _registration_data(required?:boolean): Promise<NotRequireID<Required<ClientInfo>>> {
            let fio = await this._input.wait_until_input(this._lm.askFio, this._lm.outRegQuestion);
            
            if (fio === undefined && required)
                return;

            let phone = await this._input.wait_until_input(this._lm.askPhone, this._lm.outRegQuestion);
            
            if (phone === undefined && required)
                return;

            let email = await this._input.wait_until_input(this._lm.askEmail, this._lm.outRegQuestion);
            
            if (email === undefined && required)
                return;

            console.log(this._lm.inputDateBirth);
            
            let date = await this._input.date_input(this._lm.outRegQuestion);
            
            if (date === undefined && required)
                return;

            let password = await this._input.wait_until_input(this._lm.askPassword, this._lm.outRegQuestion);
            
            if (password === undefined && required)
                return;

            let user: NotRequireID<Required<ClientInfo>> = {email: email, phone: phone, fio: fio, password: password, dateBIrth: date, type: UserRoles.client};

            return user;
    }

    async registration() {
        while (true)
        {
            let user: NotRequireID<Required<ClientInfo>> = await this._registration_data(true);

            await this._auth.hashPassword(user);

            try {
                await this._client.create(user, new Date());
                return;
            }
            catch (error) { console.log(error.message) }

            let out = await this._input.askQuestion(this._lm.outRegQuestion)
                if (out === this._lm.yes)
                    return;
        }
    }  
}