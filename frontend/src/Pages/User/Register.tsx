import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../features/UserAuth/authSlice';
import type { RootState, AppDispatch } from '../../app/store';
import { validateUserForm } from '../../utils/validation';
import { toast } from 'react-toastify';
import "./UserAuth.css"

function Register () {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const {name, email, password, confirmPassword} = formData;

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

        if(password !== confirmPassword){
            toast.error('Password do not much');
            return;
        }

        const validationError = validateUserForm({ name, email, password }, false);

        if(validationError){
            toast.error(validationError);
            return;
        }

        const userData = {
            name,
            email,
            password
        };
        dispatch(register(userData));
        toast.success("Welcome to Empire watch")
    };

    if(isLoading){
        return <h1>Loading..</h1>;
    }

    return(
        <div className="user-auth-container">
            <div className="user-auth-card">
                <div className="brand-header">
                    <h1 className="brand-name">EmpireWatch</h1>
                    <div className="brand-subtitle">USER PORTAL</div>
                </div>

                <section className="heading">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join EmpireWatch today</p>
                </section>

                <section className="form">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={name}
                                placeholder="Enter your name"
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
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
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </form>
                    
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Register;