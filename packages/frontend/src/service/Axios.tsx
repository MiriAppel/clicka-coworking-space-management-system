import axios from 'axios';

const server = 'http://localhost:3001';

//חיבור לשרת הAPI של המשתמשים
export const axiosInstance = axios.create({
    baseURL: server,
})