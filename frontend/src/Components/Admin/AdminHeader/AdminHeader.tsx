import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogout, adminReset } from '../../../features/AdminAuth/adminAuthSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import './AdminHeader.css'; 

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { admin } = useSelector((state: RootState) => state.adminAuth);

  const onLogout = () => {
    dispatch(adminLogout());
    dispatch(adminReset());
    navigate('/admin/login'); 
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="header-logo">
          <Link to="/admin/dashboard" className="brand-link">
            Empire Watch <span className="brand-badge">ADMIN</span>
          </Link>
        </div>

        <div className="header-actions">
          {admin ? (
            <>
              <div className="admin-profile">
                <div className="admin-avatar">
                  <FaUserShield />
                </div>
                <div className="admin-info">
                  <span className="admin-name">{admin.name || 'Administrator'}</span>
                  <span className="admin-role">Super User</span>
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
    </header>
  );
}

export default AdminHeader;