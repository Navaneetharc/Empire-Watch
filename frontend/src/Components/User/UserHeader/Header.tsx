import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout,reset } from '../../../features/UserAuth/authSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import authService from '../../../features/UserAuth/authService';
import ProfileModal from '../ProfileModal/ProfileModal';
import './header.css'; 
import { useState } from 'react';
import { toast } from 'react-toastify';


function UserHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user} = useSelector((state: RootState) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/user/login'); 
  };

  const handleUpload = async (file: File) => {
    try {
      await authService.uploadProfileImage(file);
      window.location.reload();

    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload image');
    }
  }

  const profileImageUrl = user?.profileImage 
    ? `http://localhost:5000${user.profileImage}` 
    : null;

  return (
    <header className="user-header">
      <div className="user-header-content">
        <div className="header-logo">
          <Link to="/" className="brand-link">
            Empire Watch <span className="brand-badge">user</span>
          </Link>
        </div>

        <div className="header-actions">
          {user ? (
            <>
              <div className="user-profile"
              onClick={() => setIsModalOpen(true)}
              style={{cursor: 'pointer'}}
              title='Click to update profile picture'
              >
                <div className="user-avatar">

                  {profileImageUrl ? (
                    <img 
                     src={profileImageUrl} 
                     alt="Profile"
                     style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
                     />
                  ):(
                  <FaUserShield />
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name || 'useristrator'}</span>
                  <span className="user-role">Super User</span>
                </div>
              </div>

              <div className="divider-vertical"></div>

              <button className="btn-logout" onClick={onLogout}>
                <FaSignOutAlt /> 
                <span>Logout</span>
              </button>
            </>
          ) : (
             <div className="restricted-badge">Restricted Access</div>
          )}
        </div>
      </div>
      {isModalOpen && (
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpload={handleUpload} 
        currentImage={profileImageUrl} 
      />
    )}
    </header>
  );
}

export default UserHeader;