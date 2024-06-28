import "reflect-metadata";
import RegisterDependency from '../registerdependency';
import { container } from 'tsyringe';
import { Mechanic } from '@blrealization/mechanic/mechanic';
import { Client } from '@blrealization/client/client';
import { SheduleRecord } from '@blrealization/shedulerecord/shedulerecord';
import { Application } from '@blrealization/application/application';
import { Admin } from '@blrealization/admin/admin';
import { TimeTableRecord } from '@blrealization/timetablerecord/timetablerecord';
import { Vocation } from '@blrealization/vocation/vocation';
import { Box } from '@blrealization/box/box';
import { Car } from '@blrealization/car/car';
import { Service } from '@blrealization/service/service';
import { AdminName, ApplicationName, BoxName, CarName, ClientName, MechanicName, ServiceName, SheduleRecordName, TimeTableRecordName, VocationName } from '../bl/interfaces/realization/interfacesnames';
import { UserInfo, UserRoles } from '../bl/types/userinfo/userinfo';
import AuthCLI from './auth/authcli';
import { InfoMessagesCLI, Menues } from "./types";
import Input from "./input/input";
import { returnAuthData } from "./auth/types";
import { LanguageModel } from "./depencecli";
import RuBase from "./languagemodel/rusbase";
import ServiceCLI from "./services/serviceCLI";
import CarCLI from "./car/carcli";
import ILanguageModel from "./languagemodel/ILanguageModel.inteface";
import ApplicationCLI from "./application/applicationcli";
import UserCLI from "./user/usercli";


class CLI {
    private _token: any;
    private _application: ApplicationCLI;
    private _userCLI: UserCLI;
    private _user: any;
    private _input: Input
    private _auth: AuthCLI;
    private _admin: AdminCLI;
    private _services: ServiceCLI;
    private _cars: CarCLI;
    private _lm: ILanguageModel;

    private _printSelfInfo()
    {
        console.log(this._lm.userFIO + this._user.fio);
        console.log(this._lm.userEmail + this._user.email);

        if (this._user.type == UserRoles.client)
        {
            console.log(this._lm.userPhone + this._user.phone)
            console.log(this._lm.userDatebirth + this._user.dateBIrth.toLocaleDateString());
            console.log(this._lm.userType + this._lm.userRoleClient)
        }
        else if (this._user.type == UserRoles.admin)
        {
            console.log(this._lm.userType + this._lm.userRoleAdmin)
        }
        else
        {
            console.log(this._lm.userType + this._lm.userRoleMechanic)
        }

        console.log(this._lm.userRolePassword + this._lm.userPasswordCapcha);
    }

    private async _selectAdmin(): Promise<number> {
        while (true)
        {
            if (!await this._check_token())
                return;

            let code = await this._input.askQuestion(Menues.adminMenu);

            if (code === '0')
                return 0;   
            else if (code == '1')
            {
                await this._services.printPriceList();
                return 1;
            }
            else if (code == '2')
            {
                await this._cars.printCarList(this._user)
                return 1
            }
            else if (code == '3')
            {
                await this._cars.updateCarList(this._user)
                return 1
            }
            else if (code == '4')
            {
                await this._application.print_client_applications(this._user)
                return 1
            }
            else if (code == '5')
            {
                await this._application.create_application(this._user);
                return 1
            }
            else if (code == '6')
            {
                this._printSelfInfo()
                return 1
            }
            else if (code == '7')
            {
                await this._userCLI.client_update_info(this._user);
                this._user = await this._userCLI.get_self_info(this._user);
                return 1
            }
            else
                console.log(InfoMessagesCLI.incorrectInput);
        }
    }

    private async _selectMechanic(): Promise<number> {
        console.log(this._user);
        console.log(this._token);
        return 0;
    }

    private async _check_token()
    {
        if (!await this._auth.checkToken(this._token))
        {
            console.log(this._lm.tokenExpired);
            this._token = undefined;
            this._user = undefined;
            return false;
        }

        return true;
    }

    private async _selectClient(): Promise<number> {
        while (true)
        {
            if (!await this._check_token())
                return;

            let code = await this._input.askQuestion(Menues.clientMenu);

            if (code === '0')
                return 0;   
            else if (code == '1')
            {
                await this._services.printPriceList();
                return 1;
            }
            else if (code == '2')
            {
                await this._cars.printCarList(this._user)
                return 1
            }
            else if (code == '3')
            {
                await this._cars.updateCarList(this._user)
                return 1
            }
            else if (code == '4')
            {
                await this._application.print_client_applications(this._user)
                return 1
            }
            else if (code == '5')
            {
                await this._application.create_application(this._user);
                return 1
            }
            else if (code == '6')
            {
                this._printSelfInfo()
                return 1
            }
            else if (code == '7')
            {
                await this._userCLI.client_update_info(this._user);
                this._user = await this._userCLI.get_self_info(this._user);
                return 1
            }
            else
                console.log(InfoMessagesCLI.incorrectInput);
        }
    }

    private async _selectGuest(): Promise<number> {
        while (true)
        {
            let code = await this._input.askQuestion(Menues.guestMenu);

            if (code === '0')
                return 0;   
            else if (code == '1')
            {
                await this._services.printPriceList()
                return 1;
            }
            else if (code == '2')
            {
                let res: returnAuthData | undefined = await this._auth.login();
                if (res !== undefined)
                {
                    this._user = res.user;
                    this._token = res.token;
                    return 1;
                }
            }
            else if (code == '3')
            {
                await this._auth.registration();
                return 1;
            }
            else
                console.log(InfoMessagesCLI.incorrectInput);
        }
    }

    constructor () {
        new RegisterDependency();
        container.register(LanguageModel, RuBase);
        this._token = undefined;
        this._input = new Input();
        this._auth = new AuthCLI();
        this._userCLI = new UserCLI();
        this._services = new ServiceCLI()
        this._cars = new CarCLI()
        this._lm = container.resolve(LanguageModel);
        this._application = new ApplicationCLI();
    }

    async run() {
        let endflag = false;
        while (!endflag)
        {
            let code = 1;
            if (this._user === undefined)
                code = await this._selectGuest();
            else if (this._user.type === UserRoles.client)
                code = await this._selectClient();
            else if (this._user.type === UserRoles.mechanic)
                code = await this._selectMechanic();
            else if (this._user.type === UserRoles.admin)
                code = await this._selectAdmin();

            if (!code)
                endflag = true;
        }
    }
}


let cln = new CLI();
await cln.run();