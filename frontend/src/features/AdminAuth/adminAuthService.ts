import axios from "axios";
const API_URL = '/api/auth';

interface LoginData{
    email: string;
    password: string;
}

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
// }

// interface UpdateUserData {
//   _id: string;           
//   name?: string;        
//   email?: string;        
//   role?: string;         
//   isBlocked?: boolean;  
// }

const getConfig = () => {
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    return{
        headers: {
            Authorization: `Bearer ${admin?.token}`,
        },
    };
};

const login = async (adminData: LoginData) => {
    const response = await axios.post(`${API_URL}/admin-login`, adminData);

    if(response.data){
        localStorage.setItem('admin', JSON.stringify(response.data));
    }
    return response.data;
}

const logout = () => {
    localStorage.removeItem('admin');
}

const getAllUsers = async() => {
    const response = await axios.get(`${API_URL}/users`,getConfig());
    return response.data;
}

const registerUser = async (userData: FormData) => {
    const response = await axios.post(`${API_URL}/users`, userData, getConfig());
    return response.data;
};

const updateUser = async (id: string, userData: FormData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, getConfig());
    return response.data;
};

const deleteUser = async (userId: string) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, getConfig());
    return response.data;
}

const blockUser = async (userId: string) => {
    const response = await axios.put(`${API_URL}/users/${userId}/block`, {}, getConfig());
    return response.data;
}

const unblockUser = async (userId: string) => {
    const response = await axios.put(`${API_URL}/users/${userId}/unblock`, {}, getConfig());
    return response.data;
}

const adminAuthService = {
    login,
    logout,
    getAllUsers,
    registerUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
}

export default adminAuthService;