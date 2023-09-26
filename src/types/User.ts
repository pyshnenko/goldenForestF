import {Roles} from './Enums';

export type Nullable<T> = T | null;

export interface User {
    avatar?: String,
    login: string,
    token: String,
    firstName: String,
    lastName: String,
    role: Roles,
    email: String,
    emailVerify?: boolean,
    gold: Number,
    time?: Number,
    nickname?: String,
    id?: Number,
    banTime?: String
};

export type NullableUser = User | null;
