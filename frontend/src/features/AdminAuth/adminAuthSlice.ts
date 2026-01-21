import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import adminAuthService from './adminAuthService';
import { AxiosError } from 'axios';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}


export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface NewUserData {
  name: string;
  email: string;
  password: string;
  role?: string; 
}

interface LoginData {
  email: string;
  password: string;
}


interface ErrorResponse {
  message: string;
}

interface AdminState {
  admin: AdminUser | null;
  users: User[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}



const getAdminFromStorage = (): AdminUser | null => {
  try {
    const adminString = localStorage.getItem('admin');
    if (!adminString) return null;
    return JSON.parse(adminString);
  } catch (error) {
    console.error("Error parsing admin data:", error);
    localStorage.removeItem('admin');
    return null;
  }
};

const adminUser = getAdminFromStorage();

const initialState: AdminState = {
  admin: adminUser,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const adminLogin = createAsyncThunk<AdminUser, LoginData, { rejectValue: string }>(
  'adminAuth/login',
  async (user, thunkAPI) => {
    try {
      return await adminAuthService.login(user);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
  await adminAuthService.logout();
});

export const getUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    'adminAuth/getUsers',
    async (_, thunkAPI) => {
        try {
            return await adminAuthService.getAllUsers();
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const registerUser = createAsyncThunk<User, FormData, { rejectValue: string }>(
  'adminAuth/registerUser',
  async (userData, thunkAPI) => {
    try {
      return await adminAuthService.registerUser(userData);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateUser = createAsyncThunk<User, { id: string; userData: FormData }, { rejectValue: string }>(
  'adminAuth/updateUser',
  async ({ id, userData }, thunkAPI) => {
    try {
      return await adminAuthService.updateUser(id, userData);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteUsers = createAsyncThunk<string, string, { rejectValue: string }>(
    'adminAuth/deleteUser',
    async(id, thunkAPI) => {
        try {
            await adminAuthService.deleteUser(id);
            return id;
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const blockUser = createAsyncThunk<User, string, { rejectValue: string }>(
    'adminAuth/blockUser',
    async(id, thunkAPI) => {
        try {
            return await adminAuthService.blockUser(id);
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const toggleBlockUser = createAsyncThunk<User, { id: string; isBlocked: boolean }, { rejectValue: string }>(
  'adminAuth/toggleBlock',
  async ({ id, isBlocked }, thunkAPI) => {
    try {
      if (isBlocked) {
        return await adminAuthService.unblockUser(id);
      } else {
        return await adminAuthService.blockUser(id);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminReset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload; 
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string; 
        state.admin = null;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.users = [];
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload); 
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(deleteUsers.fulfilled, (state,action) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUsers.rejected, (state,action) => {
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(blockUser.fulfilled, (state,action) => {
        state.users = state.users.map((user) => 
            user._id === action.payload._id ? action.payload : user
        )
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload; 
        }
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { adminReset } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;