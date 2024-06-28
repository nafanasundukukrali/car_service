import "reflect-metadata";
import { AdminName, ApplicationName, BoxName, CarName, ClientName, MechanicName, ServiceName, SheduleRecordName, TimeTableRecordName, VocationName } from "@blinterfaces/realization/interfacesnames";
import { Admin } from "@blrealization/admin/admin";
import { Application } from "@blrealization/application/application";
import { Box } from "@blrealization/box/box";
import { Car } from "@blrealization/car/car";
import { Client } from "@blrealization/client/client";
import { Mechanic } from "@blrealization/mechanic/mechanic";
import { Service } from "@blrealization/service/service";
import { SheduleRecord } from "@blrealization/shedulerecord/shedulerecord";
import { TimeTableRecord } from "@blrealization/timetablerecord/timetablerecord";
import { Vocation } from "@blrealization/vocation/vocation";
import { DAInjectionReg } from "@da/dainjection";
import { container } from "tsyringe";

export default class RegisterDependency {
    constructor () {
        new DAInjectionReg();
        container.register(ClientName, Client);
        container.register(MechanicName, Mechanic);
        container.register(SheduleRecordName, SheduleRecord);
        container.register(AdminName, Admin);
        container.register(ApplicationName, Application);
        container.register(TimeTableRecordName, TimeTableRecord);
        container.register(VocationName, Vocation);
        container.register(BoxName, Box);
        container.register(CarName, Car);
        container.register(ServiceName, Service);
    }
}