import { Id } from "../id/id";

export type NotRequireID<T extends {'id': Id}> = Omit<T, 'id'> & Partial<Pick<T, 'id'>>;
// export type NotRequireAllFields<T extends {'id': Id}> = Omit<T, 'id'> & Partial<Pick<T, 'id'>>;