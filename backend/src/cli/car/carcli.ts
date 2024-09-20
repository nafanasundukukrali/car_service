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
import { ICar } from "@asinterfaces/realization/ICar.interface";
import { Table } from 'console-table-printer';
import { CarInfo } from "@astypes/carinfo/carinfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";

export default class CarCLI {
    private _input: Input;
    private _client: IClient;
    private _admin: IAdmin;
    private _mechanic: IMechanic;
    private _auth: Auth;
    private _lm: ILanguageModel;
    private _car: ICar;
    private _last_carlist: CarInfo[];

    constructor () {
        this._mechanic = container.resolve(MechanicName);
        this._client = container.resolve(ClientName);
        this._admin = container.resolve(AdminName);
        this._lm = container.resolve(LanguageModel);
        this._car = container.resolve(CarName);
        this._input = new Input();
        this._auth = new Auth();
    }

    private async _print_car_list_client(initiator: ClientInfo | AdminInfo | MechanicInfo, clientInfo: ClientInfo, carInfo: Partial<CarInfo> | undefined = undefined)
    {

        if (carInfo == undefined)
            this._last_carlist = await this._car.search({owner: clientInfo.id}, clientInfo);
        else
            this._last_carlist = await this._car.search({...carInfo}, clientInfo);

        if (this._last_carlist.length === 0)
        {
            console.log(this._lm.carListEmpty);
            return;
        }

        const p = new Table({
            columns: [
                {name: '#'},
                { name: 'c1', title: this._lm.carNick }, 
                { name: 'c2', title: this._lm.carMark }, 
                { name: 'c3', title: this._lm.carYear },
                { name: 'c4', title: this._lm.carColor },
                { name: 'c5', title: this._lm.carVIN },
                ],
        });

        for (let i = 0; i < this._last_carlist.length; i++)
            p.addRow({'#': i + 1, c1: this._last_carlist[i].nick, c2: this._last_carlist[i].mark, c3: this._last_carlist[i].year, c4: this._last_carlist[i].color, c5: this._last_carlist[i].VIN})

        p.printTable();
    }


    async print_car_list(initiator: ClientInfo | AdminInfo | MechanicInfo, clientInfo: ClientInfo, carInfo: Partial<CarInfo> | undefined = undefined) {
        return await this._print_car_list_client(initiator, clientInfo, carInfo);
    }

    async get_car_number(initiator: ClientInfo | AdminInfo | MechanicInfo, client: ClientInfo, outquestion: string)
    {
        if (initiator.type == UserRoles.mechanic)
            return;
        
        await this._print_car_list_client(initiator, client);

        if (this._last_carlist.length === 0)
            return;

        let i: any = NaN;

        while (isNaN(i))
        {
            i = await this._input.wait_input_positive_integer(this._lm.inputCarNUmber, this._lm.outUpdateCarQuestion);
            if (i === undefined)
                return undefined;
            if (i > this._last_carlist.length)
            {
                console.log(this._lm.inputIncorrect);
                i = NaN;

                let out = await this._input.askQuestion(outquestion);

                if (out === this._lm.yes)
                    return undefined;
            }
        }

        return this._last_carlist[i - 1];
    }

    async updateCarClient(initiator: ClientInfo | AdminInfo, clientInfo: ClientInfo)
    {
        let crinf: CarInfo | undefined = await this.get_car_number(initiator, clientInfo, this._lm.outUpdateCarQuestion)

        if (crinf === undefined)
            return;

        if (initiator.type == UserRoles.admin)
        {
            await this._upateCarByAdmin(initiator, crinf.VIN, clientInfo);
            return;
        }

        let nick = await this._input.askQuestion(this._lm.askCarNick);

        if (nick !== '' && nick !== "\n" && nick !== undefined && crinf !== undefined)
            try {
                await this._car.update({VIN: crinf.VIN, nick: nick, owner: clientInfo.id}, initiator);
            }
            catch (error)
            {
                console.log(error.message);
            }
    }

    private async _addCar(initiator: ClientInfo)
    {
        while (true)
        {
            let nick = await this._input.askQuestion(this._lm.askCarNick);
            let mark = await this._input.wait_until_input(this._lm.askCarMark, this._lm.outAddCarQuestion);

            if (mark === undefined) return;

            let run = await this._input.wait_input_positive_integer(this._lm.askCarRun, this._lm.outAddCarQuestion);

            if (run === undefined) return;

            let color = await this._input.wait_until_input(this._lm.askCarColor, this._lm.outAddCarQuestion);

            if (color === undefined) return;

            let VIN = await this._input.wait_until_input(this._lm.askCarVIN, this._lm.outAddCarQuestion);

            if (VIN === undefined) return;

            let Year = await this._input.wait_input_positive_integer(this._lm.askCarYear, this._lm.outAddCarQuestion);

            if (Year === undefined) return;

            let car: Required<CarInfo> = {VIN: VIN, mark: mark, nick: nick, year: Year, run: run, color: color, owner: initiator.id};

            try {
                this._car.create(car, initiator);
                return;
            }
            catch(error) {
                console.log(error.message);
            }

            console.log(this._lm.inputIncorrect);
            let out = await this._input.askQuestion(this._lm.outAddCarQuestion);

            if (out === this._lm.yes) return;
        }
    }

    private async _upateCarByAdmin(initiator: AdminInfo, VIN: string, owner: ClientInfo)
    {
        while (true)
        {
            let nick: string | undefined = await this._input.askQuestion(this._lm.askCarNick);

            if (nick === "")
            {
                let ans = "";

                while(ans != this._lm.yes && ans != this._lm.no)
                    ans = await this._input.askQuestion(this._lm.askCarNickEmpty);

                if (ans != this._lm.yes) nick = undefined;
            }

            let mark: string = await this._input.wait_until_input(this._lm.askCarMark, this._lm.outAddCarQuestion);
            let run: number = await this._input.wait_input_positive_integer(this._lm.askCarRun, this._lm.outAddCarQuestion);
            let color: string = await this._input.wait_until_input(this._lm.askCarColor, this._lm.outAddCarQuestion);
            let Year: number = await this._input.wait_input_positive_integer(this._lm.askCarYear, this._lm.outAddCarQuestion);
            let car: Required<CarInfo> = {VIN: VIN, mark: mark, nick: nick, year: Year, run: run, color: color, owner: owner.id};

            try {
                this._car.update(car, initiator);

                return;
            }
            catch(error) {
                console.log(error.message);
            }

            console.log(this._lm.inputIncorrect);
            let out = await this._input.askQuestion(this._lm.outAddCarQuestion);

            if (out === this._lm.yes) return;
        }
    }

    async updateCarList(initiator: ClientInfo | AdminInfo, clientInfo: ClientInfo)
    {
        let cars: CarInfo [] = await this._car.search({owner: clientInfo.id}, initiator);

        while (true)
        {
            console.log(this._lm.askInputNumber)

            let i = 0; 

            if (initiator.type === UserRoles.client)
                i++;

            if (cars.length !== 0 )
            {
                console.log(i + '. ' + this._lm.carUpdate);
                i++;
            }
            console.log(i + '. ' + this._lm.carAdd);
            i++;
            console.log(i + '. ' + this._lm.carExit);

            let num = await this._input.askQuestion("")

            if (cars.length !== 0 && num === '0')
            {
                await this.updateCarClient(initiator, clientInfo);

                return;
            }
            else if (cars.length !== 0 && num === '1')
            {
                await this._addCar(clientInfo)
                return;
            }
            else if (num === '3')
            {
                return;
            }

            console.log(this._lm.inputIncorrect);
        }

    }

}