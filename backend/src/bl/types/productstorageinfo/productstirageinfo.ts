import { AchivedStatus } from "../achivedstatus/achivedstatus"
import { Id } from "../id/id";

export type ProductStorageInfo = {
    id: Id;
    name?: string;
    status?: AchivedStatus
}