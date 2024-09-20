import { AchivedStatus } from "../achivedstatus/achivedstatus";

export enum MechanicStatusType {inVocation="inVocation"}

export type MechanicStatus = AchivedStatus | MechanicStatusType;