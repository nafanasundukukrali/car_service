import "reflect-metadata";
import { IClient } from '@asinterfaces/realization/IClient.interface';
import Input from '../input/input';
import { IAdmin } from '@asinterfaces/realization/IAdmin.interface';
import { IMechanic } from '@asinterfaces/realization/IMechanic.interface';
import Auth from '../auth/auth';
import { UserRoles } from '@astypes/userinfo/userinfo';
import { container } from "tsyringe";
import { AdminName, ApplicationName, CarName, ClientName, MechanicName, ServiceName, SheduleRecordName, TimeTableRecordName } from "@asinterfaces/realization/interfacesnames";
import { AdminInfo } from '@astypes/admininfo/admininfo';
import ILanguageModel from "../languagemodel/ILanguageModel.inteface";
import { LanguageModel } from "../depencecli";
import { ClientInfo } from "@astypes/clientinfo/clientinfo";
import { ICar } from "@asinterfaces/realization/ICar.interface";
import { Table } from 'console-table-printer';
import { CarInfo } from "@astypes/carinfo/carinfo";
import { IApplication } from "@asinterfaces/realization/IApplication.interface";
import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import { ServiceInfo } from "@astypes/serviceinfo/serviceinfo";
import { IService } from "@asinterfaces/realization/IService.interface";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { ApplicationStatus, ApplicationStatusType } from "@astypes/applicationstatus/applicationstatus";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import CarCLI from "../car/carcli";
import { ISheduleRecord } from "@asinterfaces/realization/ISheduleRecord.interface";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import Logger from "@logger/logger";
import { TimeTableRecordInfo } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import MechanicCLI from "../mechanic/mechanicli";
import { ITimeTableRecord } from "@asinterfaces/realization/ITimeTableRecord.interface";
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
    private _mechanicCLI: MechanicCLI;
    private _carCLI: CarCLI;
    private _shedule: ISheduleRecord;
    private _timeRecord: ITimeTableRecord;

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
        this._mechanicCLI = new MechanicCLI(this);
        this._shedule = container.resolve(SheduleRecordName)
        this._timeRecord = container.resolve(TimeTableRecordName);
    }

    async change_application_comment(application: ApplicationInfo, initiator: MechanicInfo)
    {
        Logger.info("Change application info, application id = " + application.id.getStringVersion() + " initiator mrchanic id = " + initiator.id.getStringVersion());

        if (application.status != BaseStatus.stored)
        {
            console.log(this._lm.impossibleUpdateComment)
            Logger.warn("Impossible add comment: not saved status, status: " + application.status)

            return;
        }

        let comment = await this._input.askQuestion(this._lm.askInputComment);

        try
        {
            await this._application.update({id: application.id, mechanicComment: comment}, initiator);
        }
        catch (error)
        {
            console.log(this._lm.impossibleUpdateComment)
            Logger.warn("Impossible add comment to application");
        }
    }

    private _get_status_string(applStat: ApplicationStatus)
    {
        if (applStat == BaseStatus.stored)
            return this._lm.savedClient;
        if (applStat == ApplicationStatusType.closed)
            return this._lm.closed;
        if (applStat == ApplicationStatusType.created)
            return this._lm.createdStatus
        else
            return this._lm.dirty
    }

    async print_full_application_info(application: ApplicationInfo, initiator: AdminInfo | MechanicInfo)
    {
        Logger.info("Print full application info, application id =" + application.id);

        let service_info: ServiceInfo;

        try
        {
            let res1 = await this._service.search({id: application.service}, initiator);
            service_info = res1[0];
            console.log(this._lm.service + ' ' + service_info.name);
        }
        catch (error)
        {
            console.log(this._lm.service + ' ' + this._lm.errorGetServiceName);
            Logger.warn("Impossible get info about service");

            return;
        }

        console.log(this._lm.status + ": " + this._get_status_string(application.status));
        let client_info: ClientInfo;
        try
        {
            let res = await this._client.search({id: application.client}, initiator);
            client_info = res[0];
            console.log(this._lm.userRoleClient + ' ' + this._lm.userFIO + client_info.fio);
        }
        catch (error)
        {
            console.log(this._lm.userRoleClient + ' ' + this._lm.userFIO + this._lm.errorGetClientName);
            Logger.warn("Impossible get info about client, client Id=" + application.client);

            return;
        }

        if (application.timeRecord && application.timeRecord.dateTime)
        {
            Logger.info("TimeTableRecord existing, id = " + application.timeRecord.id)
            console.log(this._lm.date + ': ' + application.timeRecord.dateTime.toLocaleDateString() + ' ' + application.timeRecord.dateTime.toLocaleTimeString())
            console.log(this._lm.duration + application.timeRecord.duration)

            try
            {
                let records = await this._shedule.search({id: application.timeRecord.sheduleRecord}, initiator);
                let shedule_record: SheduleRecordInfo = records[0]
                let records1 = await this._mechanic.search({id: shedule_record.mechanic}, initiator)[0];
                let mechanic_info: MechanicInfo = records1[0];

                console.log(this._lm.userRoleMechanic + ' ' + this._lm.userFIO + mechanic_info.fio);
                console.log(this._lm.box + shedule_record.box);
            }
            catch (error)
            {
                // console.log(this._lm.errorGetMechanicAndSheduleInfo);
                // Logger.warn("Impossible get info about schedule or mechanic.")
            }
        }
        else
        {
            console.log(this._lm.noDateInfo);
        }

        console.log(application.mechanicComment ? this._lm.commentMechanic + application.mechanicComment : this._lm.commentMechanic + '-');

        await this._carCLI.print_car_list(initiator, {id: application.client, type: UserRoles.client}, {VIN: application.car});
    }

    async get_application_mechanic_info(application: ApplicationInfo, initiator: AdminInfo):  Promise<MechanicInfo | undefined>
    {
        Logger.info("Get mechanic info by application ID, application id =" + application.id);
        let shedule_record: SheduleRecordInfo;

        try 
        {
            shedule_record = await this._shedule.search({id: application.timeRecord.sheduleRecord}, initiator)[0];
        }
        catch(error)
        {
            console.log(this._lm.errorGetScheduleInfo)
            Logger.warn("Impossible get schedule record info.");
            return;
        }

        try 
        {
            return await this._mechanic.search({id: shedule_record.mechanic}, initiator)[0];
        }
        catch (error)
        {
            console.log(this._lm.errorGetMechanicInfo)
            Logger.warn("Schedule record got, but it's impossible to get mechanic info, schedule record id = " + shedule_record.id);
        }
    }

    private async _input_timetable(appplication: ApplicationInfo, schedule: SheduleRecordInfo, initiator: AdminInfo): Promise<TimeTableRecordInfo | undefined>
    {
        // TODO

        return;
    }

    private async _input_shedule_info(application: MechanicInfo, initiator: AdminInfo): Promise<SheduleRecordInfo | undefined>
    {
        // TODO

        return;
    }

    private async _input_mechanic_info(application: ApplicationInfo, initiator: AdminInfo): Promise<MechanicInfo | undefined>
    {
        Logger.info("get application update info by mechanic, application id = ", application.id);

        if (application.timeRecord.sheduleRecord)
        {
            let mechanic = await this.get_application_mechanic_info(application, initiator);

            if (mechanic != undefined)
            {
                let mechanic = undefined;

                while (mechanic == undefined)
                {
                    let answer = await this._input.askQuestion(this._lm.updateApplicationAdminMenu);

                    if (answer == this._lm.no)
                        return mechanic;
                    
                    if (answer == this._lm.yes)
                        return await this._mechanicCLI.search_mechanic_by_email(initiator);

                    console.log(this._lm.incorrectInput);
                } 
            }
        }
        else
        {
            return await this._mechanicCLI.search_mechanic_by_email(initiator);
        }
    }

    private async _input_status_info(application: ApplicationInfo): Promise<ApplicationStatus | undefined>
    {
        Logger.info(`update status, application id ${application.id}`);

        if (application.status === ApplicationStatusType.dirty || application.status === ApplicationStatusType.created)
        {
            console.log(this._lm.errorImpossibleChangeApplicationStatus);

            return;
        }

        let answer = await this._input.askQuestion(this._lm.updateApplicationAdminMenu);

        if (answer === '0')
            return BaseStatus.stored;
        else if (answer === '1')
            return ApplicationStatusType.closed;

        return;
    }

    private async _get_not_status_change_params(application: ApplicationInfo, initiator: AdminInfo): Promise<ApplicationInfo | undefined>
    {
        Logger.info("Get not status change params");

        let new_info: ApplicationInfo = {...application};

        let mechanic_info = await this._input_mechanic_info(application, initiator);

        if (mechanic_info)
        {
            let schedule_info = await this._input_shedule_info(mechanic_info, initiator);

            if (schedule_info)
            {
                let timetable_info = await this._input_timetable(application, schedule_info, initiator);

                if (timetable_info)
                {
                    new_info.timeRecord = timetable_info;

                    return new_info;
                }

                Logger.warn("Error get timetable info");
            }

            Logger.warn("Error get schedule info");
        }

        Logger.warn("Error get mechanic info");
    }

    async update_application_admin(application: ApplicationInfo, initiator: AdminInfo) //: Promise<MechanicInfo>
    {
        Logger.info("update existing application, application id:" + application.id);
        
        let new_application: ApplicationInfo = {id: application.id};

        let change_menu = await this._input.askQuestion(this._lm.updateApplicationAdminMenu);

        if (change_menu == '0')
        {
            let value =  await this._input_status_info(application);

            if (value === undefined)
                return; 

            new_application.status = value;
        }

        if (change_menu == '1')
        {
            let value = await this._get_not_status_change_params(application, initiator);

           if (value === undefined)
                return; 
            
           new_application = value;
        }

        try
        {
            await this._application.update(new_application, initiator);
        }
        catch (error)
        {
            console.log(this._lm.errorImpossibleUpdateApplication);
            Logger.warn("Impossible update application");
        }

        return; //----------------------------
    }

    private async _application_input_period_dates()
    {
        Logger.info("Get appliction date period");
        console.log(this._lm.inputStartDatePeriod)
        let start_date = await this._input.date_input(this._lm.outRegQuestion)

        if (start_date !== undefined)
        {
            console.log(this._lm.inputEndDatePeriod)
            let end_date = await this._input.date_input(this._lm.outRegQuestion)

            if (end_date !== undefined)
            {
                start_date.setUTCHours(0,0,0,0)
                end_date.setUTCHours(12,59,59,59)
    
                if (start_date <= end_date)
                    return [start_date, end_date]
                else
                    console.log(this._lm.inputIncorrect)
            }
        }
    }

    private async _get_service_list(client: ClientInfo | MechanicInfo): Promise<undefined>
    {
        Logger.info("Get service list by client, client id = " + client.id.getStringVersion());

        try 
        {
            this._service_list = await this._service.getListOfAll(client);
        }
        catch (error)
        {
            console.log(this._lm.errorGetServiceName)
            Logger.warn("Impossible get service list by client");
        }
    }

    private async _get_car_info_by_client(client: ClientInfo)
    {
        Logger.info("Get cars by client, client id = " + client.id);

        try
        {
            return await this._car.search({owner: client.id}, client); 
        }
        catch
        {
            console.log(this._lm.errorGetCarInfo)
            Logger.warn("There were no cars got by client.")

            return [];
        }
    }

    private async _get_applications_by_car(car: CarInfo, client: ClientInfo)
    {
        Logger.info("Get applications by car, client id = " + car.VIN);

        try
        {
            return await this._application.search({car: car.VIN}, client); 
        }
        catch
        {
            console.log(this._lm.errorGetApplications);
            Logger.warn("There were no applications got by client.")

            return [];
        }
    }

    async print_mechanic_applications(mechanic: MechanicInfo)
    {
        Logger.info("Print mechanic applications, client id = " + mechanic.id.getStringVersion());

        if (this._service_list.length === 0)
            await this._get_service_list(mechanic);

        if (this._service_list.length === 0)
            return;

        let schedules: SheduleRecordInfo[];

        try 
        {
            schedules  = await this._shedule.search({mechanic: mechanic.id}, mechanic);
        }
        catch (error)
        {
            console.log(this._lm.errorGetScheduleInfo)
            Logger.warn("Impossible get schedule record info for this mechanic");

            return;
        }

        let applications: ApplicationInfo[] = [];

        try 
        {
            for (let i = 0; i < schedules.length; i++)
            {
                let res: ApplicationInfo[] = await this._application.search({timeRecord: {id: undefined, sheduleRecord : schedules[i].id}}, mechanic);

                for (let j = 0; j < res.length; j++)
                    applications.push(res[j]);
            }
        }
        catch (error)
        {
            console.log(this._lm.noApplicationRecord);
            Logger.info("Impossible get applications info");

            return;
        }

        if (applications.length === 0)
        {
            console.log(this._lm.noApplicationRecord);

            return;
        }

        const p = new Table({
            columns: [
                {name: '#'},
                { name: 'c1', title: this._lm.carVIN }, 
                { name: 'c2', title: this._lm.date },
                { name: 'c3', title: this._lm.status },
                ],
        });

        applications = applications.sort((a, b) => {
            if (a.status != b.status && a.status === ApplicationStatusType.dirty) return -1;
            else if (a.status != b.status && b.status === ApplicationStatusType.dirty) return 1;
            else if (a.timeRecord.dateTime  === undefined && b.timeRecord.dateTime !== undefined) return -1; 
            else if (a.timeRecord.dateTime !== undefined && b.timeRecord.dateTime === undefined) return 1; 
            else if (a.timeRecord.dateTime === undefined && b.timeRecord.dateTime === undefined) return 0; 
                
            return b.timeRecord.dateTime!.getTime() - a.timeRecord.dateTime!.getTime();
        });

        for (let i = 0; i < applications.length; i++)
            p.addRow({'#': i + 1, c1: applications[i].car, 
                        c2: applications[i].timeRecord && applications[i].timeRecord.dateTime ? applications[i].timeRecord.dateTime : '-',  
                        c3: this._get_status_string(applications[i].status)});

        p.printTable();

        return applications;
    }

    async print_client_applications(client: ClientInfo, period=false)
    {
        Logger.info("Print client cars, client id = " + client.id);
        let start_date = undefined;
        let end_date = undefined;

        if (period)
        {
            let res = await this._application_input_period_dates();

            if (res == undefined) return;

            start_date = res[0];
            end_date = res[1];
        }

        if (this._service_list.length === 0)
            await this._get_service_list(client);

        if (this._service_list.length === 0)
            return;
        
        let cars: CarInfo[] = await this._get_car_info_by_client(client);
        
        if (cars.length == 0)
            return;

        let applications: ApplicationInfo[] = [];
        let servicesNames: string[] = [];
        let carsNicks: string [] = [];

        for (let i = 0; i < cars.length; i++)
        {
            let appls: ApplicationInfo[] = await this._get_applications_by_car(cars[i], client);

            appls.forEach((value) => {
                applications.push(value);
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

        applications = applications.sort((a, b) => {
            if (a.timeRecord.dateTime  === undefined && b.timeRecord.dateTime !== undefined) return -1; 
            else if (a.timeRecord.dateTime !== undefined && b.timeRecord.dateTime === undefined) return 1; 
            else if (a.timeRecord.dateTime === undefined && b.timeRecord.dateTime === undefined) return 0; 
                
            return b.timeRecord.dateTime!.getTime() - a.timeRecord.dateTime!.getTime();
        });

        for (let i = 0; i < applications.length; i++)
            if (!start_date || applications[i].timeRecord.dateTime >= start_date && applications[i].timeRecord.dateTime <= end_date)
                p.addRow({'#': i + 1, c1: carsNicks[i], c2: applications[i].car, 
                        c3: applications[i].timeRecord && applications[i].timeRecord.dateTime ? applications[i].timeRecord.dateTime.toLocaleDateString() : '-', c4: servicesNames[i], 
                        c5: this._get_status_string(applications[i].status)});

        p.printTable();

        return applications;
    }

    async create_application(initiator: ClientInfo | MechanicInfo)
    {
        Logger.info("Create application, user role = " + initiator.type + ", user id = " +initiator.id);

        let search_user: ClientInfo; 

        if (initiator.type === UserRoles.mechanic)
        {
            // TODO
        }
        else 
            search_user = initiator;

        while (true)
        {
            if (this._service_list.length === 0)
                this._service_list = await this._get_service_list(search_user);

            if (this._service_list.length === 0)
                return;

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

            let carinf: CarInfo | undefined = await this._carCLI.get_car_number(initiator, search_user, this._lm.outCreateApplication);

            if (carinf === undefined)
                return;

            try {
                await this._application.create({car: carinf.VIN, service: this._service_list[i - 1].id, }, initiator)
                
                return;
            } 
            catch (error) 
            {
                console.log(this._lm.errorCreateApplication)
                Logger.warn("Impossible create application!");
            };

            console.log(this._lm.inputIncorrect);
            let out = await this._input.askQuestion(this._lm.outAddCarQuestion);

            if (out === this._lm.yes) return;
        }
    }
}