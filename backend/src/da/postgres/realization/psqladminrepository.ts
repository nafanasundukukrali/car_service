import { container, injectable } from "tsyringe";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { Id } from "@bltypes/id/id";
import { AdminRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { IAdminRepository } from "@blinterfaces/repository/IAdminRepository.interface";
import { AdminInfo } from "@bltypes/admininfo/admininfo";

@injectable()
export class PsqlAdminRepository implements IAdminRepository
{
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

    async create (info: NotRequireID<AdminInfo>): Promise<undefined>
    {
        await prisma.admin.create(
            {
                data: {
                    fio: info.fio,
                    email: info.email,
                    password: info.password
                }
            }
        );
    }

    async update (info: AdminInfo): Promise<undefined> {
        await prisma.admin.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                email: info?.email,
                password: info?.password,
                fio: info?.fio,
            }
        })
    }

    async search (info: Partial<AdminInfo>, pass?: number, count?: number): Promise<AdminInfo []> { 
        let resBD = await prisma.admin.findMany({
            where: {
                email:info?.email,
                id: info?.id?.getStringVersion(),
                fio: info?.fio,
                password: info?.password,
            },
            skip: pass,
            take: count
        });
        
        let res: AdminInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                type: UserRoles.admin
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<AdminInfo[]> 
    {
        let resBD = await prisma.admin.findMany({
            skip: pass,
            take: count
        });
        
        let res: AdminInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                type: UserRoles.admin
        });

        return res;
    };
}