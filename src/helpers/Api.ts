import { loginApi, privateApi } from "./HttpService";
import { LoginResData, LoginReqData, RegisterReqData, User, Checked, newGoldData } from 'types/Requests'
import { NullableUser } from "types/User";

const login = (data: LoginReqData) => {
    return loginApi().post<Array<LoginResData>>('/login', data);
};

const register = (data: RegisterReqData) => {
    return loginApi().post<Array<LoginResData>>('/register', data);
};

const checkData = (data: Checked) => {
    return loginApi().post('/check', data);
};

const join = (data: any, user: NullableUser) => {
    return privateApi(user?.token || null).post<Array<LoginResData>>('/join', data);
}

const getUsers = (user: NullableUser) => {
    return privateApi(user?.token || null).post<Array<User>>('/users', {text: 'hello'});
}

const updUser = (user: NullableUser, updUser: any) => {
    return privateApi(user?.token || null).post('/update', updUser);
}

const loginUPD = (user: NullableUser) => {
    return privateApi(user?.token || null).post<Array<LoginResData>>('/updateAuth');
};

const deleteUser = (user: NullableUser, login: string) => {
    return privateApi(user?.token || null).post<Array<LoginResData>>('/delete', {login});
};

const checkTotalMoney = (user: NullableUser) => {
    return privateApi(user?.token || null).post('/gold/total');
};

const goldTable = (user: NullableUser) => {
    return privateApi(user?.token || null).post('/gold/goldTable');
};

const newGoldValue = (user: NullableUser, bodyData: newGoldData ) => {
    return privateApi(user?.token || null).post('/gold/newValue', {...bodyData});
};

const addToTreasury = (user: NullableUser, bodyData: newGoldData ) => {
    return privateApi(user?.token || null).post('/goldTreasury/addToTreasury', {...bodyData});
};

const checkTotalMoneyTreasure = (user: NullableUser, addr: string='total') => {
    return privateApi(user?.token || null).post('/goldTreasury/total', addr);
};

const Api = {
    login,
    register,
    join,
    getUsers,
    updUser,
    loginUPD,
    checkData,
    deleteUser,
    checkTotalMoney,
    goldTable,
    newGoldValue,
    addToTreasury,
    checkTotalMoneyTreasure
}

export default Api