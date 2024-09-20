import { container, injectable } from "tsyringe";
import { IStartDayWorker } from "@asinterfaces/repository/IStartDayWorker.inerace";
import { Vocation } from "../vocation/vocation";

@injectable()
class StartDayWorker implements IStartDayWorker
{
    private _vocation: Vocation;

    constructor() 
    {
        this._vocation = new Vocation();
    }

    async start(today: Date): Promise<undefined>
    {
        await this._vocation.validateTodayVocation(today);
    }
}