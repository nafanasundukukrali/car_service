import { BaseStatus } from "../basestatus/basestatus";

export enum AchivedStatusType {archived = "archived"};

export type AchivedStatus = BaseStatus | AchivedStatusType;