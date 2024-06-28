import { PostgresInjectionReg } from "./postgres/postgresinjectctionreg";

// TODO: MongoDB Flag change!

export class DAInjectionReg {
    constructor () {
        const pg = new PostgresInjectionReg();
        pg.reg();
    }
}