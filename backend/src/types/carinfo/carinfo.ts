import { ClientInfo } from "../clientinfo/clientinfo";
import { Id } from "../id/id";

export type CarInfo  = {
    run?: number,
    color ?: string,
    mark ?: string,
    VIN: string,
    year ?: number,
    nick ?: string | undefined,
    owner ?: Id,
};
  