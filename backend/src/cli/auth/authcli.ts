import "reflect-metadata";
import { IClient } from '@blinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@blinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@blinterfaces/realization/IMechanic.interface';
import Auth from '@blrealization/auth/auth';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { Id } from '@bltypes/id/id';
import { container } from "tsyringe";
import { AdminName, ClientName, MechanicName } from "@//bl/interfaces/realization/interfacesnames";
import { AdminInfo } from '@//bl/types/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@//bl/types/clientinfo/clientinfo";
import { NotRequireID } from '../../bl/types/helperpath/helpertypes';

export default class AuthCLI {
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

    async checkToken(token: any)
    {
        return this._auth.verifyToken(token, process.env.SECRET_KEY)
    }

    async login() {
        let admin = {fio: process.env.POSTGRES_USER, password: process.env.POSTGRES_PASSWORD, type: UserRoles.admin};
        await this._auth.hashPassword(admin);

        while (true)
        {
            let user: string = await this._input.askQuestion(this._lm.askLogin);
            let password: string = await this._input.askQuestion(this._lm.askPassword);
            let relusr: AdminInfo = {id: new Id(process.env.POSTGRES_UUID), type: UserRoles.admin}
            let usr: any = {id: undefined, email: user, password: password}
            try {
                let userf: any[] = await this._client.search({email: user}, relusr);
                if (userf.length === 0)
                    userf = await this._mechanic.search({email: user}, relusr);
                if (userf.length === 0)
                    userf = await this._admin.search({email: user}, relusr);
                if (userf.length === 0)
                {
                    console.log(this._lm.infoIncorrectData);
                    let code = await this._input.askQuestion(this._lm.outEnterQuestion);
                    if (code === this._lm.yes)
                        return;
                }
                else {
                    try {
                        usr.id = userf[0].id
                        let token = await this._auth.login(usr, userf[0]?.password);
                        return {token: token, user: userf[0]}
                    }
                    catch (er) {
                        console.log(this._lm.infoIncorrectData)
                    }
                }
            }
            catch (error) {}
        }
    }  

    async registration() {
        while (true)
        {
            let fio = await this._input.wait_until_input(this._lm.askFio, this._lm.outRegQuestion);
            
            if (fio === undefined)
                return;

            let phone = await this._input.wait_until_input(this._lm.askPhone, this._lm.outRegQuestion);
            
            if (phone === undefined)
                return;

            let email = await this._input.wait_until_input(this._lm.askEmail, this._lm.outRegQuestion);
            
            if (email === undefined)
                return;

            console.log(this._lm.inputDateBirth);
            
            let date = await this._input.date_input(this._lm.outRegQuestion);
            
            if (date === undefined)
                return;

            let password = await this._input.wait_until_input(this._lm.askPassword, this._lm.outRegQuestion);
            
            if (password === undefined)
                return;

            let user: NotRequireID<Required<ClientInfo>> = {email: email, phone: phone, fio: fio, password: password, dateBIrth: date, type: UserRoles.client};

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