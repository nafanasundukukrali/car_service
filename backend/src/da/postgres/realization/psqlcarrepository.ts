import { container, injectable } from "tsyringe";
import { prisma } from "../../prismaclient";
import { Id } from "@bltypes/id/id";
import { ICarRepository } from '@blinterfaces/repository/ICarRepository.interface';
import { CarInfo } from '@bltypes/carinfo/carinfo';

@injectable()
export class PsqlCarRepository implements ICarRepository
{
    async create (info: Required<CarInfo>): Promise<undefined>
    {
        await prisma.car.create(
            {
                data: {
                    vin: info.VIN,
                    nick: info.nick,
                    year: info.year,
                    owner_: info.owner.getStringVersion(),
                    run: info.run,
                    color: info.color,
                    mark: info.mark
                }
            }
        );
    }

    async update (info: CarInfo): Promise<undefined> {
        await prisma.car.update({
            where: {
                vin: info.VIN
            },
                data: {
                    nick: info?.nick,
                    year: info?.year,
                    owner_: info?.owner?.getStringVersion(),
                    run: info?.run,
                    color: info?.color,
                    mark: info?.mark
            }
        })
    }

    async drop (info: CarInfo): Promise<undefined> {
        await prisma.car.delete({
            where: {
                vin: info.VIN
            }
        })
    }

    async search (info: Partial<CarInfo>, pass?: number, count?: number): Promise<CarInfo []> { 
        let resBD = await prisma.car.findMany({
            where: {
                vin: info?.VIN,
                nick: info?.nick,
                year: info?.year,
                owner_: info?.owner?.getStringVersion(),
                run: info?.run,
                color: info?.color,
                mark: info?.mark
            },
            skip: pass,
            take: count
        });
        
        let res: CarInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                VIN: resBD[i].vin,
                nick: resBD[i].nick,
                year: resBD[i].year,
                owner: new Id(resBD[i].owner_),
                run: resBD[i].run,
                color: resBD[i].color,
                mark: resBD[i].mark
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<CarInfo[]> 
    {
        let resBD = await prisma.car.findMany({
            skip: pass,
            take: count
        });
        
        let res: CarInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                VIN: resBD[i].vin,
                nick: resBD[i].nick,
                year: resBD[i].year,
                owner: new Id(resBD[i].owner_),
                run: resBD[i].run,
                color: resBD[i].color,
                mark: resBD[i].mark
        });

        return res;
    };
}