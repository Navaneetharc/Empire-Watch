import React, { useEffect } from 'react';
import Header from '../../Components/User/UserHeader/Header';
import authService from '../../features/UserAuth/authService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios'; 
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/UserAuth/authSlice';
import headerNews from '../../assets/header news.png'
import news1 from '../../assets/news1.png'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {

        const freshUserData = await authService.getMe();
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        const updateUser = {
          ...currentUser,
          ...freshUserData,
          token: currentUser.token
        };

        dispatch(setUser(updateUser));
        localStorage.setItem('user', JSON.stringify(updateUser));

      } catch (error) {
        const err = error as AxiosError;

        console.log("User check failed", err);

        if (err.response && err.response.status === 403) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    checkUserStatus();

    const interValid = setInterval(checkUserStatus, 3000);

    return () => clearInterval(interValid);
  }, [navigate,dispatch]);

  return (
    <>
      <Header /> 
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <img src={headerNews} alt="" style={{ maxWidth: '100%', height: 'auto' }}  />
        <img src={news1} alt="" style={{ maxWidth: '100%', height: 'auto' }}  />
      </div>
    </>
  );
};

export default Home;