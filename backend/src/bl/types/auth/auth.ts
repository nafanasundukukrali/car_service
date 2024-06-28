import { Id } from "@bltypes/id/id";

export interface IAuth {
    login: <T extends {id: Id, password?: string}> (user: T, foundedpass: string) => Promise<undefined>;
    hashPassword: <T extends {password?: string}>(user: T) => Promise<undefined>;
    validatePassword:<T extends {password?: string}>(user: T, actualyHash: string) => Promise<boolean>;
    verifyToken: (token: any) => boolean
}