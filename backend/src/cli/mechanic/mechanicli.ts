import { IMechanic } from "@asinterfaces/realization/IMechanic.interface";
import { container } from "tsyringe";
import { MechanicName, SheduleRecordName, VocationName } from '@asinterfaces/realization/interfacesnames';
import { AdminInfo } from "@astypes/admininfo/admininfo";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import Auth from "../auth/auth";
import { UserRoles } from "@astypes/userinfo/userinfo";
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import Input from "../input/input";
import { LanguageModel } from "../depencecli";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { MechanicStatusType } from "@astypes/mechanicstatus/mechanicstatus";
import { AchivedStatusType } from "@astypes/achivedstatus/achivedstatus";
import Logger from "@logger/logger";
import { ISheduleRecord } from "@asinterfaces/realization/ISheduleRecord.interface";
import { Table } from "console-table-printer";
import { IVocation } from "@asinterfaces/realization/IVocation.interface";
import { VocationInfo } from "@astypes/vocationinfo/vocationinfo";
import ApplicationCLI from "../application/applicationcli";
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";

export default class MechanicCLI {
    private _mechanic: IMechanic;
    private _auth: Auth;
    private _lm: ILanguageModel;
    private _input: Input;
    private _schedule: ISheduleRecord;
    private _vocation: IVocation;
    private _applicationCLI: ApplicationCLI;

    constructor (application: ApplicationCLI) {
        this._mechanic = container.resolve(MechanicName);
        this._auth = new Auth();
        this._lm = container.resolve(LanguageModel);
        this._input = new Input();
        this._schedule = container.resolve(SheduleRecordName);
        this._vocation = container.resolve(VocationName);
        this._applicationCLI = application;
    }

    private _validate_email(phone: string): Boolean
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        return expression.test(phone);
    }

    async print_list_of_schedule_of_mechanic(mechanic: MechanicInfo, intiator: AdminInfo)
    {
        Logger.info("Print list of schedule by mechanic id, mechanic id = " + mechanic.id.getStringVersion());
        
        try 
        {
            let schedule_list: SheduleRecordInfo[] = await this._schedule.search({mechanic: mechanic.id}, intiator);

            schedule_list.sort((a, b) => {
                if (a.day !== b.day)
                    return a.day - b.day;
                else if (a.timeStart.getUTCHours() !== b.timeStart.getUTCHours())
                    return a.timeStart.getUTCHours() - b.timeStart.getUTCHours();
                else if (a.timeStart.getUTCMinutes() !== b.timeStart.getUTCMinutes())
                    return a.timeStart.getUTCMinutes() - b.timeStart.getUTCMinutes();

                return 0;
            })

            const p = new Table({
                columns: [
                    {name: '#'},
                    { name: 'c1', title: this._lm.dayWeek},
                    {name: 'c2', title: this._lm.status},
                    {name: 'c3', title: this._lm.timeStart},
                    {name: 'c4', title: this._lm.timeEnd} 
                ],
            });
    
            for (let i = 0; i < schedule_list.length; i++)
                p.addRow({'#': i + 1, c1: schedule_list[i].day, 
                            c2: schedule_list[i].status === BaseStatus.stored ? this._lm.savedMechanicSchedule : this._lm.archived, 
                            c3: schedule_list[i].timeStart.getUTCHours() + ':' + schedule_list[i].timeStart.getUTCMinutes(),
                            c4: schedule_list[i].timeEnd.getUTCHours() + ':' + schedule_list[i].timeEnd.getUTCMinutes()
                        });
    
            p.printTable();

            return schedule_list;
        }
        catch(error)
        {
            // TODO
        }
    }

    async search_mechanic_by_email(initiator: AdminInfo)
    {
        Logger.info("Search mechanic by email, initiator admin id = " + initiator.id?.getStringVersion());

        let seacrh_email = await this._input.askQuestion(this._lm.askEmail);

        if (!this._validate_email(seacrh_email))
        {
            console.log(this._lm.errorIncorrectEmail);
            Logger.warn("Inccorect email format.")

            return;
        }

        try
        {
            let res = await this._mechanic.search({email: seacrh_email}, initiator);

            if (res.length > 1 || res.length == 0)
            {
                console.log(this._lm.incorrectInput);

                if (res.length == 0)
                    Logger.warn("No mechanic with email " + seacrh_email)
                else
                    Logger.warn("More than one user has email " + seacrh_email);

                return;
            }

            return res[0];
        }
        catch (error)
        {
            console.log(this._lm.incorrectInput)
            Logger.warn("There was search error");

            return;
        }
    }

    private async _work_wih_one_application(application: ApplicationInfo, mechanic: MechanicInfo)
    {
        while (true)
        {
            let result = await this._input.askQuestion(this._lm.mechanicApplicationMenu);
            
            if (result == '0')
                return;
            else if (result == '1')
                await this._applicationCLI.change_application_comment(application, mechanic);
            else
                console.log(this._lm.incorrectInput);
        }
    }

    async work_with_self_applications(mechanic: MechanicInfo)
    {
        Logger.info("Mechanic works with self applications, mechanic id = " + mechanic.id.getStringVersion());

        let applications = await this._applicationCLI.print_mechanic_applications(mechanic);

        let number = await this._input.wait_number_from_1_to_n(applications.length, this._lm.askInputApplicationNumber, this._lm.outRegQuestion);

        if (number === undefined || Number(number) <= Number(0) || Number(number) > applications.length)
        {
            console.log(this._lm.incorrectInput);
            Logger.info(`Incorrect applications number: number ${number}, application count: ${applications.length}`);

            return;
        }

        try
        {
            await this._applicationCLI.print_full_application_info(applications[Number(number) - 1], mechanic);
            await this._work_wih_one_application(applications[Number(number) - 1], mechanic);
        }
        catch(error)
        {
            console.log(this._lm.impossibleWorkWithApplication);
            Logger.warn("Impossible work with this application");
        }
    }

    async print_mechanic_vocation_schedule(initiator: AdminInfo | MechanicInfo, mechanic: MechanicInfo)
    {
        Logger.info(`Print mechanic id = ${mechanic.id.getStringVersion()} vocation schedule`);

        try 
        {
            let vocation_list: VocationInfo[] = await this._vocation.search({who: mechanic.id}, initiator);

            const p = new Table({
                columns: [
                    {name: '#'},
                    {name: 'c1', title: this._lm.dateStart},
                    {name: 'c2', title: this._lm.dateEnd} 
                ],
            });
    
            for (let i = 0; i < vocation_list.length; i++)
                p.addRow({'#': i + 1, c1: vocation_list[i].startDate.toLocaleDateString('en-GB'), 
                            c2:vocation_list[i].endDate.toLocaleDateString('en-GB'), 
                        });
    
            p.printTable();

            return vocation_list;
        }
        catch(error)
        {
            Logger.warn("Impossible print mechanic vocation list");
        }
    }

    private async _delete_exitsting_vocation_record(initiator: AdminInfo, mechanic: MechanicInfo, vocations: VocationInfo[])
    {
        Logger.info("Update existing vocation for mechanic id =" + mechanic.id.getStringVersion());

        let number: Number = await this._input.wait_number_from_1_to_n(vocations.length, this._lm.vocationDeleteAsk,this._lm.outRegQuestion);

        if (number > new Number(0) && number <= new Number(vocations.length))
        {
            try
            {
                let rec = vocations[Number(number) - 1];
                await this._vocation.dropVocation({id: rec.id, startDate: rec.startDate, 
                    endDate: rec.endDate, who: rec.who}, initiator, new Date);
            }
            catch (error)
            {
                console.log(this._lm.errorDeleteVocation)
                Logger.warn("Impossible delete record");
            }
        }
        else
        {
            console.log(this._lm.incorrectInput)
            Logger.warn("Incorrect input number of vocations element")
        }
    }

    private async _add_mechanic_vocation_info(initiator: AdminInfo, mechanic: MechanicInfo)
    {
        Logger.info("Add new vocation period for mechanic id =" + mechanic.id.getStringVersion())
        let date_perod = await this._input.input_date_period_no_repit();

        if (date_perod !== undefined)
        {
            try
            {
                await this._vocation.planeVocation({startDate: date_perod[0], endDate: date_perod[1], 
                    who: mechanic.id}, initiator, new Date());
            }
            catch (error)
            {
                console.log(this._lm.errorImpossibleCreateSameVocationPeriod);
                Logger.warn("Impossible create vocation for date period from" + date_perod[0].toLocaleDateString() + " to " + date_perod[1].toLocaleDateString())
            }
        }
    }

    async work_with_mechanic_vocations(initiator: AdminInfo, mechanic: MechanicInfo)
    {
        Logger.info(`Work with menu of mechanic vocation schedule, mechanic id = ${mechanic.id.getStringVersion()}, admin id = ${initiator.id.getStringVersion()}`);

        let vocations = await this.print_mechanic_vocation_schedule(initiator, mechanic);

        if (vocations == undefined)
            return;

        while (true)
        {
            let answer = await this._input.askQuestion(this._lm.vocationMenuForAdmin);

            if (answer === '0')
            {
                return;
            }
            else if (answer === '2')
            {
                await this._delete_exitsting_vocation_record(initiator, mechanic, vocations);
            }
            else if (answer === '3')
            {
                await this._add_mechanic_vocation_info(initiator, mechanic);
            }
            else if (answer !== '1') 
            {
                console.log(this._lm.incorrectInput);
                continue;
            }

            vocations = await this.print_mechanic_vocation_schedule(initiator, mechanic);
        }
    }

    async mechanic_update_info(initiator: AdminInfo, updatesubject: MechanicInfo) 
    {
        Logger.info("Update mechanic info my admin, id = ", initiator.id.getStringVersion());

        while (true)
        {
            let user = await this._get_info(false);

            if (user == undefined)
                return;

            if (user.status == undefined)
                user.status = updatesubject.status;

            user.id = updatesubject.id;
            // user.email = user.email !== undefined ? user.email : updatesubject.email;
            // user.fio = user.fio !== undefined ? user.fio : updatesubject.fio;
            // user.password = user.password !== undefined ? user.password: updatesubject.password;
            
            try {
                await this._mechanic.update({id: user.id, status: user.status, 
                    email: user.email, 
                    fio: user.fio,
                    password: user.password, 
                    type: UserRoles.mechanic}, initiator);

                return;
            }
            catch (error) 
            { 
                console.log(this._lm.errorImpossibleUpdateMechanic);
                Logger.warn("Error in updating mechanic info.")
            }

            Logger.info("Retry update mechanic")

            let out = await this._input.askQuestion(this._lm.outRegQuestion)
                if (out === this._lm.yes)
                    return;
        }
    }  

    private async _get_status(): Promise<MechanicStatusType | AchivedStatusType | BaseStatus>
    {
        Logger.info("Input mechanic status by User.")

        while (true)
        {
            let answer = await this._input.askQuestion(this._lm.askMechanicStatus);

            if (answer == '0')
                return undefined;
            else if (answer == '1')
                return AchivedStatusType.archived;
            else if (answer == '2')
                return BaseStatus.stored;
            else
                console.log(this._lm.incorrectInput);
        }
    }

    private async _get_info(isNew=true): Promise<NotRequireID<Required<MechanicInfo>>> {
        Logger.info("Get mechanic Info for create record or update");

        let fio = await this._input.wait_until_input(this._lm.askFio, this._lm.outRegQuestion);
        let email = await this._input.wait_until_input(this._lm.askEmail, this._lm.outRegQuestion);
        let password = await this._input.wait_until_input(this._lm.askPassword, this._lm.outRegQuestion);
        let status: MechanicStatusType | AchivedStatusType | BaseStatus = BaseStatus.stored;

        if (!isNew)
            status = await this._get_status();

        let user: NotRequireID<Required<MechanicInfo>> = {email: email, fio: fio, password: password, type: UserRoles.mechanic, status: status};
        
        if (password !== undefined)
            await this._auth.hashPassword(user);

        return user;
    }  
}