import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { adminLogin,adminReset } from "../../features/AdminAuth/adminAuthSlice";
import './AdminLogin.css'

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { admin, isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.adminAuth
    );

    useEffect(() => {

        if(isError) {
            alert("Error" + message);
        }

        if(isSuccess || admin){
            if(admin?.role === 'admin'){
                navigate('/admin/dashboard');
            }else{
                alert("Access Denied: You are not an Admin.");
                navigate('/');
            }
        }

        dispatch(adminReset());
    }, [admin, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(adminLogin({ email, password}));
    };

    if (isLoading) {
    return <h1>Loading Admin Portal...</h1>;
    }

    return (
    <div className='admin-login-container'>
      <div className='admin-login-card'>
        <div className='brand-header'>
          <h1 className='brand-name'>EmpireWatch</h1>
          <div className='brand-subtitle'>ADMINISTRATION</div>
        </div>

        <section className='heading'>
          <h1 className='admin-title'>Admin Portal</h1>
          <p className='restricted-text'>Restricted Access</p>
        </section>

        <section className='form'>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='email'
                className='form-control'
                id='email'
                name='email'
                value={email}
                placeholder='Enter Admin Email'
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                id='password'
                name='password'
                value={password}
                placeholder='Enter Admin Password'
                onChange={onChange}
                required
              />
            </div>

            <div className='form-group'>
              <button type='submit' className='btn btn-admin'>
                Login as Admin
              </button>
            </div>
          </form>

          <div className='divider'>
            <span>OR</span>
          </div>

          <button 
            className='btn btn-user' 
            onClick={() => navigate('/login')}
          >
            Login as User
          </button>
        </section>
      </div>
    </div>
  );
}
