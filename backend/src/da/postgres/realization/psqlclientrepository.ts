import { IClientRepository } from "@blinterfaces/repository/IClientRepository.interface";
import { container, injectable } from "tsyringe";
import { NotRequireID } from "@bltypes/helperpath/helpertypes";
import { ClientInfo } from "@bltypes/clientinfo/clientinfo";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@bltypes/userinfo/userinfo";
import { Id } from "@bltypes/id/id";

@injectable()
export class PsqlClientRepository implements IClientRepository
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

    async create (info: NotRequireID<ClientInfo>): Promise<undefined>
    {
        await prisma.client.create(
            {
                data: {
                    fio: info.fio,
                    email: info.email,
                    password: info.password,
                    phone: info.phone,
                    datebirth: info.dateBIrth
                }
            }
        );
    }

    async update (info: ClientInfo): Promise<undefined> {
        await prisma.client.update({
            where: {
                id: info.id.getStringVersion()
            },
            data: {
                email: info?.email,
                phone: info?.phone,
                password: info?.password,
                fio: info?.fio,
                datebirth: info.dateBIrth
            }
        })
    }

    async search (info: Partial<ClientInfo>, pass?: number, count?: number): Promise<ClientInfo []> { 
        let resBD = await prisma.client.findMany({
            where: {
                email:info?.email,
                datebirth: info?.dateBIrth,
                id: info?.id?.getStringVersion(),
                fio: info?.fio,
                password: info?.password,
                phone: info?.phone,
            },
            skip: pass,
            take: count
        });
        
        let res: ClientInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                dateBIrth: resBD[i]?.datebirth,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                phone: resBD[i]?.phone,
                type: UserRoles.client
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<ClientInfo[]> 
    {
        let resBD = await prisma.client.findMany({
            skip: pass,
            take: count
        });
        
        let res: ClientInfo[] = []
        for (let i = 0; i < resBD.length; i++)
            res.push({
                email: resBD[i]?.email,
                dateBIrth: resBD[i]?.datebirth,
                id: new Id(resBD[i]?.id),
                fio: resBD[i]?.fio,
                password: resBD[i]?.password,
                phone: resBD[i]?.phone,
                type: UserRoles.client
        });

        return res;
    };

    async validatePhoneExisting(phone: string): Promise<boolean>
    {
        const clients_phone = await prisma.client.findFirst({
            where: {
                phone: phone
            }
        });

        return clients_phone !== null;
    }
}