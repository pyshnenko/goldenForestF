
export interface LoginResData {
    token: String,
    first_name: String,
    last_name: String
}

export interface LoginReqData {
    login: String,
    password: String
}

export interface RegisterReqData { 
    first_name: String,
    last_name: String,
    login: String,
    password: String
}
export interface JoinReqData { 
    nickname?: String,
    first_name?: String,
    last_name?: String,
    surname?: String,
    phone?: Number, 
    email?: String,
    birth_date?: String,
    vk?: String,
    telegram?: String,
    about?: String,
    allergy?: String,
    emergency_contact?: String
}

export interface User{
    id: Number,
    first_name: String,
    last_name: String,
    login: String,
    role: String,
    gold: Number,
    time?: Number,
    userAcc?: null,
    banTime?: string
}

export interface FullData extends JoinReqData {
    id: Number,
    login: String,
    role: String,
    gold: Number,
    token?: string,
    banTime?: string
}

export interface Checked {
    login?: string,
    phone?: string,
    email?: string,
    nickname?: string
}

export interface CheckResult {
    res: string
}

export interface newGoldData {
    login: string,
    value: number,
    date: number,
    way?: string
}

export interface addToTreasuryData {
    login: string,
    value: number,
    date: number,
    addr?: string,
    way: string
}