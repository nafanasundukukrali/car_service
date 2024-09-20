import { ApplicationInfo } from "@astypes/applicationinfo/applicationinfo";
import { TimeTableRecordInfo } from "@astypes/timetablerecordinfo/timetablerecordinfo";
import { NotRequireID } from "../../types/helperpath/helpertypes";

export interface IApplicationRepository {
    create: (info: NotRequireID<ApplicationInfo>) => Promise<undefined>;
    drop: (Info: ApplicationInfo) => Promise<undefined>;
    dropByOneTransaction: (info: ApplicationInfo[]) => Promise<undefined>;
    update: (info: ApplicationInfo) => Promise<undefined>;
    updateByOneTransaction: (infoArr: ApplicationInfo[]) => Promise<undefined>;
    search: (info: Partial<ApplicationInfo>, pass?: number, count?: number) 
                                                        => Promise<ApplicationInfo []>;
    getListOfAll: (pass?: number, count?: number) => Promise<ApplicationInfo[]>
}