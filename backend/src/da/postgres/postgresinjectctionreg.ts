import { ApplicationRepositoryName, ClientRepositoryName, SheduleRecordRepositoryName, TimeTableRecordRepositoryName, VocationRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { container } from "tsyringe";
import { PsqlClientRepository } from "./realization/psqlclientrepository";
import { AdminRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { PsqlAdminRepository } from "./realization/psqladminrepository";
import { MechanicRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { PsqlMechanicRepository } from "./realization/psqlmechanicrepository";
import { PsqlCarRepository } from "./realization/psqlcarrepository";
import { CarRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { BoxRepositoryName } from "@blinterfaces/repository/interfacesnames";
import { PsqlBoxRepository } from "./realization/psqlboxrepository";
import { PsqlServiceRepository } from './realization/psqlservicerepository';
import { ServiceRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { PsqlSheduleRecord } from "./realization/psqlshedulerecord";
import { PsqlTimeTableRecord } from "./realization/psqltimetablerepository";
import { PsqlApplicationRepository } from "./realization/psqlapplication";
import { PsqlVocationRepository } from "./realization/psqlvocation";
export class PostgresInjectionReg {
    reg () {
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