import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "./authService";
import { AxiosError } from "axios";

interface RegisterData{
    name: string;
    email: string;
    password: string;
}

interface LoginData{
    email: string;
    password: string;
    is_admin?: boolean;
}

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  profileImage?: string;
}

interface AuthState{
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: AuthState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const register = createAsyncThunk(
    'auth/register',
    async (user: RegisterData, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
                return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (user: LoginData, thunkAPI) => {
        try {
            console.log("");
            return await authService.login(user);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
             const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
                return thunkAPI.rejectWithValue(message);
        }
    }
);

// export const adminLogin = createAsyncThunk(
//     'auth/adminLogin',
//     async(user: LoginData, thunkAPI) => {
//         try {
//             return await authService.login({...user, is_admin: true});
//         } catch (err) {
//             const error = err as AxiosError<{message: string}>;
//             const message = (error.response && error.response.data && error.response.data.message) ||
//                             error.message ||
//                             error.toString();

//             return thunkAPI.rejectWithValue(message);
//         }
//     },
// )

export const logout = createAsyncThunk('auth/logout', async() => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(register.rejected,(state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
            state.user = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state,action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
            state.user = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
        })
    }
})



export const {reset,setUser} = authSlice.actions;
export default authSlice.reducer;
