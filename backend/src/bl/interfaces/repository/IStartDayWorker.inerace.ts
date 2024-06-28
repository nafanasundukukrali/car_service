export interface IStartDayWorker
{
    start: (today: Date) => Promise<undefined>;
}

