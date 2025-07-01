import axios from 'axios';

//להחליף למשתנה סביבה
const server = 'http://localhost:3001/api';

//חיבור לשרת הAPI של המשתמשים
export const axiosInstance = axios.create({
    baseURL: server,
})