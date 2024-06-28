import { IBoxRepository } from "@blinterfaces/repository/IBoxRepository,interface";
import { container, injectable } from "tsyringe";
import { BoxInfo } from "@bltypes/boxinfo/boxinfo";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { Id } from "@bltypes/id/id";

@injectable()
export class PsqlBoxRepository implements IBoxRepository
{
    async search (info: Partial<BoxInfo>, pass?: number, count?: number): Promise<BoxInfo []> { 
        let resBD = await prisma.box.findMany({
            where: {
                id: info?.id?.getStringVersion(),
                number: info?.number
            },
            skip: pass,
            take: count
        });
        
        let res: BoxInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                id: new Id(resBD[i]?.id),
                number: resBD[i]?.number
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<BoxInfo[]> 
    {
        let resBD = await prisma.box.findMany({
            skip: pass,
            take: count
        });
        
        let res: BoxInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                id: new Id(resBD[i]?.id),
                number: resBD[i]?.number
        });

        return res;
    };
}