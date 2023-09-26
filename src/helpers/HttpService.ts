import axios from "axios";
import { Nullable } from "types/User";

const baseURL = "https://gf.spamigor.ru/api";//"https://a78a49fe-20b1-409a-b0dc-a2a83c5aa3f3.mock.pstmn.io";
const jsonHeader = {
  "Content-type": "application/json"
};

export const loginApi = () => axios.create({
  baseURL,
  headers: jsonHeader
});

export const privateApi = (token: Nullable<String>) => axios.create({
  baseURL,
  headers: {
    ...jsonHeader,
    "Authorization": `Bearer ${token}`
  }
});

export const getApi = (value: string)=> axios.get(`${baseURL}/register?name=${value}`)