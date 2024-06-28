import { AdminInfo } from "../admininfo/admininfo"
import { CarInfo } from "../carinfo/carinfo"
import { ProductStorageInfo } from "../productstorageinfo/productstirageinfo"
import { ContractBailmentStatus } from "../contractbailmentstatus/contractbailmentstatus"
import { ClientInfo } from "../clientinfo/clientinfo"
import { Id } from "../id/id"

export type ContractBailmentInfo = {
    id: Id,
    car ?: string,
    dateStart ?: Date,
    duration ?: Date,
    subject ?: Id,
    whoseCar?: Id,
    whoFormed?: Id,
    status ?: ContractBailmentStatus,
}