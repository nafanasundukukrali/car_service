import { PostgresInjectionReg } from "./postgres/postgresinjectctionreg";
import Logger from "@logger/logger";

// TODO: MongoDB Flag change!

export class DAInjectionReg {
    constructor () {
        Logger.info("Register DA injection.");
        
        const pg = new PostgresInjectionReg();
        pg.reg();
    }
}