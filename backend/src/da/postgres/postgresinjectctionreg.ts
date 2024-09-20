import { ApplicationRepositoryName, ClientRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName, VocationRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { container } from "tsyringe";
import { PsqlClientRepository } from "./realization/psqlclientrepository";
import { AdminRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { PsqlAdminRepository } from "./realization/psqladminrepository";
import { MechanicRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { PsqlMechanicRepository } from "./realization/psqlmechanicrepository";
import { PsqlCarRepository } from "./realization/psqlcarrepository";
import { CarRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { BoxRepositoryName } from "@asinterfaces/repository/interfacesnames";
import { PsqlBoxRepository } from "./realization/psqlboxrepository";
import { PsqlServiceRepository } from './realization/psqlservicerepository';
import { ServiceRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { PsqlSheduleRecord } from "./realization/psqlshedulerecord";
import { PsqlTimeTableRecord } from "./realization/psqltimetablerepository";
import { PsqlApplicationRepository } from "./realization/psqlapplication";
import { PsqlVocationRepository } from "./realization/psqlvocation";
import Logger from "@logger/logger";

export class PostgresInjectionReg {
    reg () {
        Logger.info("Register postgres injections.");

        container.register(ClientRepositoryName, PsqlClientRepository);
        container.register(AdminRepositoryName, PsqlAdminRepository);
        container.register(MechanicRepositoryName, PsqlMechanicRepository);
        container.register(CarRepositoryName, PsqlCarRepository);
        container.register(BoxRepositoryName, PsqlBoxRepository);
        container.register(ServiceRepositoryName, PsqlServiceRepository);
        container.register(SheduleRecordRepositoryName, PsqlSheduleRecord);
        container.register(TimeTableRecordRepositoryName, PsqlTimeTableRecord);
        container.register(ApplicationRepositoryName, PsqlApplicationRepository);
        container.register(VocationRepositoryName, PsqlVocationRepository);
    }
}