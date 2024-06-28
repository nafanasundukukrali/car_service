import "reflect-metadata";
import { IClient } from '@blinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@blinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@blinterfaces/realization/IMechanic.interface';
import Auth from '@blrealization/auth/auth';
import { UserRoles } from '@bltypes/userinfo/userinfo';
import { container } from "tsyringe";
import { AdminName, CarName, ClientName, MechanicName } from "@//bl/interfaces/realization/interfacesnames";
import { AdminInfo } from '@//bl/types/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@//bl/types/clientinfo/clientinfo";
import { ICar } from "@//bl/interfaces/realization/ICar.interface";
import { Table } from 'console-table-printer';
import { CarInfo } from "@//bl/types/carinfo/carinfo";

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

    private async _printCarListClient(initiator: ClientInfo)
    {
        this._last_carlist = await this._car.search({owner: initiator.id}, initiator);

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


    async printCarList(initiator: ClientInfo | AdminInfo) {
        if (initiator.type == UserRoles.client)
            await this._printCarListClient(initiator);
        // let services: CarInfo [] = await this._car.search({owner: initiator.id}, initiator);

        // if (services.length === 0)
        // {
        //     console.log(this._lm.carListEmpty);
        //     return;
        // }

        // if (initiator.type == UserRoles.client)
        // {
        //     const p = new Table({
        //         columns: [
        //             { name: 'c1', title: this._lm.carNick }, 
        //             { name: 'c2', title: this._lm.carMark }, 
        //             { name: 'c3', title: this._lm.carYear },
        //             { name: 'c4', title: this._lm.carColor },
        //             { name: 'c5', title: this._lm.carVIN },
        //           ],
        //     });
        // }
        // else
        // {
        //     const p = new Table({
        //         columns: [
        //             { name: 'c1', title: this._lm.carNick }, 
        //             { name: 'c2', title: this._lm.carMark }, 
        //             { name: 'c3', title: this._lm.carYear }, 
        //           ],
        //     });
        // }

    
        // for (let i = 0; i < services.length; i++)
        //     p.addRow({c1: services[i].name, c2: services[i].discription, c3: services[i].price})

        // p.printTable();
    }

    async get_car_number(initiator: ClientInfo, outquestion: string)
    {
        await this._printCarListClient(initiator);

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

    private async _updateCarClient(initiator: ClientInfo)
    {
        let crinf: CarInfo | undefined = await this.get_car_number(initiator, this._lm.outUpdateCarQuestion)

        if (crinf === undefined)
            return;

        let nick = await this._input.askQuestion(this._lm.askCarNick);

        if (nick !== '' && nick !== "\n" && nick !== undefined && crinf !== undefined)
            try {
                await this._car.update({VIN: crinf.VIN, nick: nick, owner: initiator.id}, initiator);
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

    async updateCarList(initiator: ClientInfo)
    {
        let cars: CarInfo [] = await this._car.search({owner: initiator.id}, initiator);

        while (true)
        {
            console.log(this._lm.askInputNumber)
            let i = 1;
            if (cars.length !== 0 )
            {
                console.log(i + '. ' + this._lm.carUpdate);
                i++;
            }
            console.log(i + '. ' + this._lm.carAdd);

            let num = await this._input.askQuestion("")

            if (cars.length !== 0 && num === '1')
            {
                await this._updateCarClient(initiator)
                return;
            }
            else if (num === '2' || num === '1')
            {
                await this._addCar(initiator)
                return;
            }

            console.log(this._lm.inputIncorrect);
        }

    }

}