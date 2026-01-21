import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { login, reset } from "../../features/UserAuth/authSlice";
import type { RootState, AppDispatch } from "../../app/store";
import "./UserAuth.css"
import { toast } from "react-toastify";


function Login(){
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {user, isLoading, isError, isSuccess, message} = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if(isError){
            toast.error(message);
        }

        if(isSuccess || user){
            navigate('/');
        }

        dispatch(reset());
    },[user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
        toast.success("Welcome back to Empire Watch")
    };

    if(isLoading){
        return <h1>Loading...</h1>
    }

    return (
        <div className="user-auth-container">
            <div className="user-auth-card">
                <div className="brand-header">
                    <h1 className="brand-name">EmpireWatch</h1>
                    <div className="brand-subtitle">USER PORTAL</div>
                </div>

                <section className="heading">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to start syncing</p>
                </section>

                <section className="form">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input type="email"
                                   className="form-control"
                                   id="email"
                                   name="email"
                                   value={email}
                                   placeholder="Enter your email"
                                   onChange={onChange}
                                   required
                             />
                        </div>
                        <div className="form-group">
                            <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={onChange}
                            required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>
                    
                    <p className="auth-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button 
                        className="btn btn-admin-link" 
                        onClick={() => navigate('/admin/login')}
                    >
                        Are you an Admin? Login here
                    </button>
                </section>
            </div>
        </div>
    )
}

export default Login;