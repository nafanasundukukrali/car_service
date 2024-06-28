import { IApplicationRepository } from "@blinterfaces/repository/IApplicationRepository.interface";
import { injectable } from "tsyringe";
import { prisma } from "../../prismaclient";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { ApplicationInfo } from "@bltypes/applicationinfo/applicationinfo";
import { get_status_by_id } from "@//bl/realization/applicationstatus/applicationstatus";
import { get_application_status_id } from '../../../bl/realization/applicationstatus/applicationstatus';
import { Id } from "@bltypes/id/id";

@injectable()
export class PsqlApplicationRepository implements IApplicationRepository
{
    async create (info: NotRequireID<ApplicationInfo>): Promise<undefined> {
        await prisma.application.create({
            data: {
                car: info.car,
                service: info.service.getStringVersion(),
                status: get_application_status_id(info.status)
            }
        });
    }

    async drop (info: ApplicationInfo): Promise<undefined> {
        await prisma.application.delete({
            where: {
                id: info?.id?.getStringVersion(),
                car: info?.car,
                service: info?.service?.getStringVersion(),
                status: get_application_status_id(info?.status)
            }
        });
    }

    async dropByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined> {
        let operationsArr = [];

        for (let i = 0; i < infoArr.length; i++)
            operationsArr.push(
                prisma.application.delete({
                    where: {
                        id: infoArr[i]?.id?.getStringVersion(),
                        car: infoArr[i]?.car,
                        service: infoArr[i]?.service?.getStringVersion(),
                        status: get_application_status_id(infoArr[i]?.status)
                    }
                })
            );
            

        await prisma.$transaction(operationsArr);
    }

    async update (info: NotRequireID<ApplicationInfo>): Promise<undefined> {
        await prisma.application.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                comment: info?.mechanicComment,
                service: info?.service?.getStringVersion(),
                status: get_application_status_id(info?.status),
                car: info?.car
            }
        });
    }

    async updateByOneTransaction (infoArr: ApplicationInfo[]): Promise<undefined> {
        let operationsArr = [];

        for (let i = 0; i < infoArr.length; i++)
            operationsArr.push(
                prisma.application.update({
                    where: {
                        id: infoArr[i].id.getStringVersion()
                    },
                    data: {
                        comment: infoArr[i]?.mechanicComment,
                        service: infoArr[i]?.service?.getStringVersion(),
                        status: get_application_status_id(infoArr[i]?.status),
                        car: infoArr[i]?.car
                    }
                })
            );
            

        await prisma.$transaction(operationsArr);
    }

    async search (info: Partial<ApplicationInfo>, pass?: number, count?: number): Promise<ApplicationInfo[]> {
        let resBD = await prisma.application.findMany({
            include: {
                timetable: true,
                service_application_serviceToservice: {
                    include: {
                        canbeserved_canbeserved_serviceToservice: true
                    }
                },
                car_application_carTocar: true
            },
            where: {
                id: info?.id?.getStringVersion(),
                timerecord: info?.timeRecord?.id?.getStringVersion(),
                service: info?.service?.getStringVersion(),
                status: get_application_status_id(info?.status),
                car: info?.car
            },
            skip: pass,
            take: count
        });
    
        let res: ApplicationInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                car: resBD[i]?.car,
                mechanicComment: resBD[i]?.comment,
                timeRecord: {
                    id: new Id(resBD[i]?.timetable?.id),
                    sheduleRecord: new Id(resBD[i]?.timetable?.shedule),
                    dateTime: resBD[i]?.timetable?.datetime,
                    duration: resBD[i]?.service_application_serviceToservice?.canbeserved_canbeserved_serviceToservice[0]?.hours
                },
                service: new Id(resBD[i]?.service),
                status: get_status_by_id(new Id(resBD[i]?.status)),
                client: new Id(resBD[i]?.car_application_carTocar.owner_)
            });
        }

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<ApplicationInfo[]> {
        let resBD = await prisma.application.findMany({
            include: {
                timetable: true,
                service_application_serviceToservice: {
                    include: {
                        canbeserved_canbeserved_serviceToservice: true
                    }
                },
                car_application_carTocar: true
            },
            skip: pass,
            take: count
        });
    
        let res: ApplicationInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                car: resBD[i]?.car,
                mechanicComment: resBD[i]?.comment,
                timeRecord: {
                    id: new Id(resBD[i].timetable.id),
                    sheduleRecord: new Id(resBD[i].timetable.shedule),
                    dateTime: resBD[i]?.timetable.datetime,
                    duration: resBD[i]?.service_application_serviceToservice.canbeserved_canbeserved_serviceToservice[0].hours
                },
                service: new Id(resBD[i]?.service),
                status: get_status_by_id(new Id(resBD[i]?.status)),
                client: new Id(resBD[i]?.car_application_carTocar.owner_)
            });
        }

        return res;
    }
}