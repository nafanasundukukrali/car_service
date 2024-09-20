import { IVocationRepository } from "@asinterfaces/repository/IVocationRepository.interface";
import { injectable } from "tsyringe";
import { prisma } from "../../prismaclient";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { VocationInfo } from "@astypes/vocationinfo/vocationinfo";
import { Id } from "@astypes/id/id";

@injectable()
export class PsqlVocationRepository implements IVocationRepository
{
    async create (info: NotRequireID<VocationInfo>): Promise<undefined> {
        info.startDate.setUTCMilliseconds(0);
        info.startDate.setUTCMinutes(0);
        info.startDate.setUTCHours(0);
        info.endDate.setUTCMilliseconds(0);
        info.endDate.setUTCMinutes(0);
        info.endDate.setUTCHours(0);
        await prisma.vocation.create({
            data: {
                mechanic: info?.who?.getStringVersion(),
                start_date: info?.startDate,
                end_date: info?.endDate
            }
        });
    }

    async drop(info: VocationInfo): Promise<undefined> {
        await prisma.vocation.delete({
            where: {
                id: info.id.getStringVersion()
            }
        });
    }

    async search (info: Partial<VocationInfo>, pass?: number, count?: number): Promise<VocationInfo []> {
        let resBD = await prisma.vocation.findMany({
            where: {
                mechanic: info?.who?.getStringVersion(),
                start_date: info?.startDate,
                end_date: info?.endDate
            },
            skip: pass,
            take: count
        });

        let res: VocationInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                who: new Id(resBD[i]?.mechanic),
                startDate: resBD[i]?.start_date,
                endDate: resBD[i]?.end_date
            });
        }

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<VocationInfo[]> {
        let resBD = await prisma.vocation.findMany({
            skip: pass,
            take: count
        });
    
        let res: VocationInfo[] = []
        for (let i = 0; i < resBD.length; i++)
        {
            res.push({
                id: new Id(resBD[i]?.id),
                who: new Id(resBD[i]?.mechanic),
                startDate: resBD[i]?.start_date,
                endDate: resBD[i]?.end_date
            });
        }

        return res;
    }
}