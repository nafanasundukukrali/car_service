import { Id } from "../id/id"
import { AchivedStatus } from "../achivedstatus/achivedstatus"


type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type SheduleRecordInfo = {
    id: Id,
    mechanic?: Id,
    day?: Range<1, 8>,
    timeStart?: Date,
    timeEnd?: Date,
    box?: Id,
    status?: AchivedStatus 
}