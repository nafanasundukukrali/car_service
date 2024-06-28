import { Id } from "@bltypes/id/id";
import { errorUserInDb } from "@blerrors/user/usererrors";

export class RealizationBase {
    protected async _validate_existing_user<T>(user: Id, searchFunc: (T) => Promise<T[]>)
    {
        let arr: T[] = await searchFunc({id: user});

        if (arr.length !== 1)
            throw Error(errorUserInDb.userNotExist);
    }

    protected _compare_day_times(d_1: Date, d_2: Date): number
    {
        let res: boolean = d_1.getUTCHours() === d_2.getUTCHours() && d_1.getUTCMinutes() === d_2.getUTCMinutes();
        if (res)
            return 0;
        res = d_1.getUTCHours() > d_2.getUTCHours() || d_1.getUTCHours() == d_2.getUTCHours() && d_1.getUTCMinutes() > d_2.getUTCMinutes();
        return res ? 1 : -1;
    }

    protected _compare_days(d_1: Date, d_2: Date): number
    {
        let res: boolean = d_1.getUTCDate() === d_2.getUTCDate() && d_1.getUTCMonth() === d_2.getUTCMonth() && d_1.getUTCFullYear() === d_2.getUTCFullYear();
        if (res)
            return 0;
        res = (d_1.getUTCFullYear() > d_2.getUTCFullYear() || 
                d_1.getUTCFullYear() === d_2.getUTCFullYear() && d_1.getUTCMonth() > d_2.getUTCMonth() || 
                d_1.getUTCFullYear() === d_2.getUTCFullYear() && d_1.getUTCMonth() === d_2.getUTCMonth() && d_1.getUTCDate() > d_2.getUTCDate());
        return res ? 1 : -1;
    }

    protected _get_only_date(date: Date) {
        let newDate: Date = date;
        newDate.setUTCMilliseconds(0);
        newDate.setUTCHours(0);
        newDate.setUTCMinutes(0);

        return newDate;
    }
}