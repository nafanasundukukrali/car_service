import { container, injectable } from "tsyringe";
import { NotRequireID } from "@astypes/helperpath/helpertypes";
import { prisma } from "../../prismaclient";
import { UserRoles } from "@astypes/userinfo/userinfo";
import { Id } from "@astypes/id/id";
import { IMechanicRepository } from "@asinterfaces/repository/IMechanicRepository.interface";
import { MechanicInfo } from "@astypes/mechanicinfo/mechanicinfo";
import { BaseStatus } from "@astypes/basestatus/basestatus";
import { MechanicStatus, MechanicStatusType } from "@astypes/mechanicstatus/mechanicstatus";
import { AchivedStatus, AchivedStatusType } from '@astypes/achivedstatus/achivedstatus';
import Logger from "@logger/logger";

function convert_status_from_number(value: number)
    {
        if (value == 0)
            return BaseStatus.stored;
        if (value == 1)
            return MechanicStatusType.inVocation;
        if (value == 2)
            return AchivedStatusType.archived;

        Logger.warn("Unknown status number value " + value)
    }

function convert_status_to_number(value: MechanicStatus)
    {
        if (value === BaseStatus.stored)
            return 0;
        if (value === MechanicStatusType.inVocation)
            return 1;
        if (value === AchivedStatusType.archived)
            return 2;

        Logger.warn("Unknown status type value " + value)
    }

@injectable()
export class PsqlMechanicRepository implements IMechanicRepository
{
    async updateByOneTransaction(infoArr: MechanicInfo[]): Promise<undefined>
    {
        Logger.info("Update by one tranczaction ");
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
        Logger.info("Validate email existing in database " + email);

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
        Logger.info("Create mechanic record " + info.id.getStringVersion());

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
        Logger.info("Update mechanic record " + info.id);

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
        Logger.info("Seacrh by mechanic info " + info.id?.getStringVersion());

        let resBD = await prisma.mechanic.findMany({
            where: {
                email:info?.email,
                id: info?.id?.getStringVersion(),
                fio: info?.fio,
                password: info?.password,
                status: info?.status !== undefined ? convert_status_to_number(info.status) : undefined
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
                type: UserRoles.mechanic,
                status: convert_status_from_number(resBD[i]?.status)
        });

        return res;
    }

    async getListOfAll (pass?: number, count?: number): Promise<MechanicInfo[]> 
    {
        Logger.warn("Get all list of mechanics");

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