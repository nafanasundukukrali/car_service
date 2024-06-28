import { container, injectable } from "tsyringe";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { Id } from "@bltypes/id/id";
import { IMechanicRepository } from "@blinterfaces/repository/IMechanicRepository.interface";
import { MechanicInfo } from "@bltypes/mechanicinfo/mechanicinfo";

@injectable()
export class PsqlMechanicRepository implements IMechanicRepository
{
    async updateByOneTransaction(infoArr: MechanicInfo[]): Promise<undefined>
    {
        let operationsArr = [];

        for (let i = 0; i < infoArr.length; i++)
            operationsArr.push(
                prisma.mechanic.update({
                    where: {
                        id: infoArr[i].id.getStringVersion()
                    },
                    data: {
                        email: infoArr[i]?.email,
                        password: infoArr[i]?.password,
                        fio: infoArr[i]?.fio
                    }
                })
            );
            

        await prisma.$transaction(operationsArr);
    }

    async validateEmailExisting (email: string): Promise<boolean> 
    {
        const clients_emails = await prisma.client.findFirst({
            where: {
                email: email
            }
        });

        const admin_emails = await prisma.admin.findFirst({
            where: {
                email: email
            }
        });

        const mechanic_emails = await prisma.mechanic.findFirst({
            where: {
                email: email
            }
        });

        return clients_emails !== null ||  admin_emails !== null || mechanic_emails !== null;
    }

    async create (info: NotRequireID<MechanicInfo>): Promise<undefined>
    {
        await prisma.mechanic.create(
            {
                data: {
                    fio: info.fio,
                    email: info.email,
                    password: info.password
                }
            }
        );
    }

    async update (info: MechanicInfo): Promise<undefined> {
        await prisma.mechanic.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                email: info?.email,
                password: info?.password,
                fio: info?.fio
            }
        })
    }

    async search (info: Partial<MechanicInfo>, pass?: number, count?: number): Promise<MechanicInfo []> { 
        let resBD = await prisma.mechanic.findMany({
            where: {
                email:info?.email,
                id: info?.id?.getStringVersion(),
                fio: info?.fio,
                password: info?.password
            },
            skip: pass,
            take: count
        });
        
        let res: MechanicInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                type: UserRoles.mechanic
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<MechanicInfo[]> 
    {
        let resBD = await prisma.mechanic.findMany({
            skip: pass,
            take: count
        });
        
        let res: MechanicInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                type: UserRoles.mechanic
        });

        return res;
    };
}