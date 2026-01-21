import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/UserAuth/authSlice';
import adminReducer from '../features/AdminAuth/adminAuthSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
