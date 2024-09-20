import { container, injectable } from "tsyringe";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { Id } from "@astypes/id/id";
import { SheduleRecordInfo } from "@astypes/shedulerecordinfo/shedulerecordinfo";
import { ISheduleRecordRepository } from "@asinterfaces/repository/ISheduleRecordRepository.interface";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { AchivedStatusType } from '@astypes/achivedstatus/achivedstatus';

@injectable()
export class PsqlSheduleRecord implements ISheduleRecordRepository
{
    async create (info: NotRequireID<SheduleRecordInfo>): Promise<undefined>
    {
        if (info.timeStart)
        {
            info.timeStart.setUTCDate(1);
            info.timeStart.setUTCMonth(1);
            info.timeStart.setUTCFullYear(1970);
        }
        if (info.timeEnd)
        {
                info.timeEnd.setUTCDate(1);
                info.timeEnd.setUTCMonth(1);
                info.timeEnd.setUTCFullYear(1970);
        }
        await prisma.shedule.create(
            {
                data: {
                    starttime: info?.timeStart,
                    endtime: info.timeEnd,
                    mechanic: info?.mechanic?.getStringVersion(),
                    box: info?.box?.getStringVersion(),
                    dayweek: info?.day
                }
            }
        );
    }

    async update (info: SheduleRecordInfo): Promise<undefined> {
        if (info.timeStart)
        {
            info.timeStart.setUTCDate(1);
            info.timeStart.setUTCMonth(1);
            info.timeStart.setUTCFullYear(1970);
        }
        if (info.timeEnd)
        {
                info.timeEnd.setUTCDate(1);
                info.timeEnd.setUTCMonth(1);
                info.timeEnd.setUTCFullYear(1970);
        }
        let status;
        if (info.status)
            status = info?.status == BaseStatus.stored ? 0 : 1
        await prisma.shedule.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                starttime: info?.timeStart,
                endtime: info.timeEnd,
                mechanic: info?.mechanic?.getStringVersion(),
                box: info?.box?.getStringVersion(),
                dayweek: info?.day,
                status: status
            }
        })
    }

    async search (info: Partial<SheduleRecordInfo>, pass?: number, count?: number): Promise<SheduleRecordInfo []> { 
        if (info.timeStart)
        {
            info.timeStart.setUTCDate(1);
            info.timeStart.setUTCMonth(1);
            info.timeStart.setUTCFullYear(1970);
        }
        if (info.timeEnd)
        {
                info.timeEnd.setUTCDate(1);
                info.timeEnd.setUTCMonth(1);
                info.timeEnd.setUTCFullYear(1970);
        }
        let status;
        if (info.status)
            status = info?.status == BaseStatus.stored ? 0 : 1
        let resBD = await prisma.shedule.findMany({
            where: {
                id: info?.id?.getStringVersion(),
                starttime: info?.timeStart,
                endtime: info.timeEnd,
                mechanic: info?.mechanic?.getStringVersion(),
                box: info?.box?.getStringVersion(),
                dayweek: info?.day,
                status: status
            },
            skip: pass,
            take: count
        });
        
        let res: SheduleRecordInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            let dayweek: any = resBD[i]?.dayweek;
            res.push({
                id: new Id(resBD[i]?.id),
                timeStart: resBD[i]?.starttime,
                timeEnd: resBD[i].endtime,
                mechanic: new Id(resBD[i]?.mechanic),
                box: new Id(resBD[i]?.box),
                day: dayweek && dayweek >= 1 && dayweek <= 7 ? dayweek : 1,
                status: resBD[i]?.status == 0 ? BaseStatus.stored : AchivedStatusType.archived
            });
        }

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<SheduleRecordInfo[]> 
    {
        let resBD = await prisma.shedule.findMany({
            skip: pass,
            take: count
        });
        
        let res: SheduleRecordInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            let dayweek: any = resBD[i]?.dayweek;
            res.push({
                id: new Id(resBD[i]?.id),
                timeStart: resBD[i]?.starttime,
                timeEnd: resBD[i].endtime,
                mechanic: new Id(resBD[i]?.mechanic),
                box: new Id(resBD[i]?.box),
                day: dayweek && dayweek >= 1 && dayweek <= 7 ? dayweek : 1,
                status: resBD[i]?.status == 0 ? BaseStatus.stored : AchivedStatusType.archived
            });
        }

        return res;
    };
}