import { container, injectable } from "tsyringe";
import { prisma } from "../../prismaclient";
import { Id } from "@astypes/id/id";
import { ITimeTableRecordRepository } from "@asinterfaces/repository/ITimeTableRecordRepository.interface";
import { TimeTableRecordInfo, TimeTableRecordList } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import { get_application_status_id, get_status_by_id } from '@astypes/applicationstatus/applicationstatus';
import { UserRoles } from '@astypes/userinfo/userinfo';

@injectable()
export class PsqlTimeTableRecord implements ITimeTableRecordRepository
{

    async update (info: TimeTableRecordInfo): Promise<undefined> {
        await prisma.timetable.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                datetime: info?.dateTime,
                shedule: info?.sheduleRecord?.getStringVersion()
            }
        });
    }

    private async _get_searchList_DA_result(info: Partial<TimeTableRecordList>, who: Id, pass: number, count: number) {
        if (info.dateTime)
            info.dateTime.setUTCMilliseconds(0)
        if (info.client?.dateBIrth)
            info.client.dateBIrth.setUTCMilliseconds(0)
        
        return await prisma.timetable.findMany({
            include: {
                application: {
                    include: {
                        car_application_carTocar: {
                            include: {
                                client: true
                            }
                        },
                        service_application_serviceToservice: {
                            include: {
                                canbeserved_canbeserved_serviceToservice: true
                            }
                        }
                    }
                }
            },
            where: {
                shedule_timetable_sheduleToshedule: {
                    mechanic: who?.getStringVersion()
                },
                id: info?.id?.getStringVersion(),
                application: {
                    every: {
                        id: info?.application?.id?.getStringVersion(),
                        service: info?.application?.service?.getStringVersion(),
                        status: get_application_status_id(info?.application?.status),
                        car: info?.application?.car
                    },
                }
            },
            skip: pass,
            take: count
        });
    }

    private _result_client_check(result: any, info: Partial<TimeTableRecordList>) {
        result.filter((value) => {
            let flagarr = [1, 1, 1, 1, 1, 1]

            if (info?.client?.id && value.application[0].car_application_carTocar.client.id !== info.client.id.getStringVersion())
                flagarr[0] = 0
            if (info?.client?.dateBIrth && 
                (value.application[0].car_application_carTocar.client.datebirth.getUTCFullYear() !== info.client.dateBIrth.getUTCFullYear() ||
                value.application[0].car_application_carTocar.client.datebirth.getUTCMonth() !== info.client.dateBIrth.getUTCMonth() ||
                value.application[0].car_application_carTocar.client.datebirth.getUTCDate() !== info.client.dateBIrth.getUTCDate()))
                flagarr[1] = 0
            if (info?.client?.email && value.application[0].car_application_carTocar.client.email !== info.client.email)
                flagarr[2] = 0
            if (info?.client?.fio && value.application[0].car_application_carTocar.client.fio !== info.client.fio)
                flagarr[3] = 0
            if (info?.client?.password && value.application[0].car_application_carTocar.client.password !== info.client.password)
                flagarr[4] = 0
            if (info?.client?.phone && value.application[0].car_application_carTocar.client.phone !== info.client.phone)
                flagarr[5] = 0

            return flagarr.every((value) => value === 1)
        })
    }

    async searchList (info: Partial<TimeTableRecordList>, who?: Id, pass?: number, count?: number): Promise<TimeTableRecordList []> { 
        let result = await this._get_searchList_DA_result(info, who, pass, count);
        this._result_client_check(result, info);

        let res: TimeTableRecordList[] = []
        for (let i = 0; i < result.length; i++)
        {
            res.push({
                id: new Id(result[i]?.id),
                application: {
                    id: new Id(result[i].application[0].id),
                    car: result[i].application[0].car,
                    mechanicComment: result[i].application[0].comment,
                    service: new Id(result[i].application[0].service),
                    status: get_status_by_id(new Id(result[i].application[0].status))
                },
                client: {
                    id: new Id(result[i].application[0].car_application_carTocar.client.id),
                    dateBIrth: result[i].application[0].car_application_carTocar.client.datebirth,
                    phone: result[i].application[0].car_application_carTocar.client.phone, 
                    fio: result[i].application[0].car_application_carTocar.client.fio,
                    email: result[i].application[0].car_application_carTocar.client.email,
                    type: UserRoles.client
                },
                dateTime: result[i].datetime,
                duration: result[i].application[0].service_application_serviceToservice.canbeserved_canbeserved_serviceToservice[0].hours
            });
        }

        return res;
    }

    async search (info: Partial<TimeTableRecordInfo>, who: Id, pass?: number, count?: number): Promise<TimeTableRecordInfo []> { 
        if (info.dateTime)
            info.dateTime.setUTCMilliseconds(0)

        let resBD = await prisma.timetable.findMany({
            include: {
                application: {
                    include: {
                        service_application_serviceToservice: {
                            include: {
                                canbeserved_canbeserved_serviceToservice: true
                            }
                        }
                    }
                }
                },
            where: {
                id: info?.id?.getStringVersion(),
                shedule: info?.sheduleRecord?.getStringVersion(),
                datetime: info?.dateTime,
                application: {
                    every: {
                        service_application_serviceToservice: {
                            canbeserved_canbeserved_serviceToservice: {
                                every: {
                                    hours: info?.duration
                                }
                            }
                        }
                    }
                }
            },
            skip: pass,
            take: count
        });
        
        let res: TimeTableRecordInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                sheduleRecord: new Id(resBD[i]?.shedule),
                dateTime: resBD[i]?.datetime,
                duration: resBD[i].application[0].service_application_serviceToservice.canbeserved_canbeserved_serviceToservice[0].hours
            });
        }

        return res;
    }

    async searchDatePeriod (info: Partial<TimeTableRecordInfo>, startDate: Date, endDate: Date): Promise<TimeTableRecordInfo []> { 
        if (info.dateTime)
            info.dateTime.setUTCMilliseconds(0)
        startDate.setUTCMilliseconds(0)
        startDate.setUTCMinutes(0)
        startDate.setUTCHours(0)
        endDate.setUTCMilliseconds(0)
        endDate.setUTCMinutes(0)
        endDate.setUTCHours(0)

        let resBD = await prisma.timetable.findMany({
            include: {
                application: {
                    include: {
                        service_application_serviceToservice: {
                            include: {
                                canbeserved_canbeserved_serviceToservice: true
                            }
                        }
                    }
                }
                },
            where: {
                id: info?.id?.getStringVersion(),
                shedule: info?.sheduleRecord?.getStringVersion(),
                datetime: {
                    gte: startDate,
                    lt: endDate
                },
                application: {
                    every: {
                        service_application_serviceToservice: {
                            canbeserved_canbeserved_serviceToservice: {
                                every: {
                                    hours: info?.duration
                                }
                            }
                        }
                    }
                }
            }
        });
        
        let res: TimeTableRecordInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                sheduleRecord: new Id(resBD[i]?.shedule),
                dateTime: resBD[i]?.datetime,
                duration: resBD[i].application[0].service_application_serviceToservice.canbeserved_canbeserved_serviceToservice[0].hours
            });
        }

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<TimeTableRecordInfo[]> 
    {
        let resBD = await prisma.timetable.findMany({
            include: {
                application: {
                    include: {
                        service_application_serviceToservice: {
                            include: {
                                canbeserved_canbeserved_serviceToservice: true
                            }
                        }
                    }
                }
                },
            skip: pass,
            take: count
        });
        
        let res: TimeTableRecordInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                sheduleRecord: new Id(resBD[i]?.shedule),
                dateTime: resBD[i]?.datetime,
                duration: resBD[i].application[0].service_application_serviceToservice.canbeserved_canbeserved_serviceToservice[0].hours
            });
        }

        return res;
    };
}