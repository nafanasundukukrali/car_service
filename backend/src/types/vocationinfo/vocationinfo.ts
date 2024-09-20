import { Id } from "../id/id"

export type VocationInfo = {
    id: Id,
    who?: Id,
    startDate?: Date,
    endDate?: Date
}