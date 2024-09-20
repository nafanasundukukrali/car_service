import "reflect-metadata";
import { IClient } from '@asinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@asinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@asinterfaces/realization/IMechanic.interface';
import Auth from '../auth/auth';
import { UserRoles } from '@astypes/userinfo/userinfo';
import { Id } from '@astypes/id/id';
import { container } from "tsyringe";
import { AdminName, ClientName, MechanicName } from "@asinterfaces/realization/interfacesnames";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { NotRequireID } from '@astypes/helperpath/helpertypes';
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";

export default class UserCLI {
    private _input: Input;
    private _client: IClient;
    private _admin: IAdmin;
    private _mechanic: IMechanic;
    private _auth: Auth;
    private _lm: ILanguageModel;

    constructor () {
        this._mechanic = container.resolve(MechanicName);
        this._client = container.resolve(ClientName);
        this._admin = container.resolve(AdminName);
        this._lm = container.resolve(LanguageModel);
        this._input = new Input();
        this._auth = new Auth();
    }

    async get_self_info(initiator: ClientInfo | AdminInfo | MechanicInfo)
    {
        if (initiator.type === UserRoles.client)
        {
            let res = (await this._client.search({id: initiator.id, type: initiator.type}, initiator))[0];
            return res;
        }
        else if (initiator.type === UserRoles.admin)
            return (await this._admin.search({id: initiator.id, type: initiator.type}, initiator))[0];
        else
            return (await this._mechanic.search({id: initiator.id, type: initiator.type}, initiator))[0];       
    }

    async client_update_info(initiator: ClientInfo | AdminInfo, chanclient ?: ClientInfo, required = true) {
        while (true)
        {
            let user: ClientInfo = {...await this._registration_data(required), id: chanclient.id};
            
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