import axiosInstance from "../../api/axiosInstance";

const API_URL = '';

interface RegisterData {
    name?: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
    is_admin?: boolean
}

const register = async (userData: RegisterData) => {
    const response = await axiosInstance.post(API_URL + 'register', userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const login = async (userData: LoginData) => {

    const endpoint = userData.is_admin ? 'admin-login' : 'login';
    const response = await axiosInstance.post(API_URL + endpoint, userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

const getMe = async () => {
    const response = await axiosInstance.get(API_URL + 'me');
    return response.data;
}

const logout = () => {
    localStorage.removeItem('user');
};

const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await axiosInstance.put('users/profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const currentUser = await JSON.parse(localStorage.getItem('user') || '{}');
    if(response.data){
        const updatedUser = {...currentUser,...response.data};
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response.data;
}

const authService = { 
    register,
    logout,
    login,
    getMe,
    uploadProfileImage,
}

export default authService;