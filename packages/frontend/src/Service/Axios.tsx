import axios from 'axios';
const server = process.env.REACT_APP_API_URL;
//חיבור לשרת הAPI של המשתמשים
export const axiosInstance = axios.create({
    baseURL: server,
<<<<<<<< HEAD:packages/frontend/src/services/Axios.ts
})
========
    headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Enable sending cookies with requests
    });
    
    export default axiosInstance;
>>>>>>>> ce4631774996556b75702ebbab2f7b3b6635c0c1:packages/frontend/src/Service/Axios.tsx
