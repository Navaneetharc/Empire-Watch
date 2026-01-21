import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '/api/auth',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if(user && user.token){
            config.headers.Authorization =  `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && (error.response.status === 403 || error.response.status === 401)){
            const errorMessage = error.response.data.message || "";
            localStorage.removeItem('user');
            window.location.href = '/login';
            console.log(errorMessage);
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;