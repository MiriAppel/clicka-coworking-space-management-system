import axios from 'axios';

const server =  'http://localhost:3000' ;

//חיבור לשרת הAPI של המשתמשים
export const axiosInstance = axios.create({
    baseURL: server,
})
/*
import axios from 'axios';

const server = process.env.REACT_APP_API_URL;

//חיבור לשרת הAPI של המשתמשים
export const axiosInstance = axios.create({
    baseURL: server,
})*/