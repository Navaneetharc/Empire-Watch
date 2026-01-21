import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
  getUsers, 
  deleteUsers,      
  toggleBlockUser,   
  adminReset,
  registerUser,      
  updateUser         
} from '../../features/AdminAuth/adminAuthSlice';

import type { User } from '../../features/AdminAuth/adminAuthSlice'; 
import type { RootState, AppDispatch } from '../../app/store';
import UserModal from './UserModal/UserModal';
import './UserManagement.css';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { users, isLoading, isError, message } = useSelector(
    (state: RootState) => state.adminAuth
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getUsers());

    return () => {
      dispatch(adminReset());
    };
  }, [dispatch]);

;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setSelectedUser(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (selectedUser) {
      await dispatch(updateUser({ 
          id: selectedUser._id, 
          userData: formData 
      })).unwrap();
      toast.success("Congratulations! User updated successfully.");
    } else {
      await dispatch(registerUser(formData));
      toast.success("Congratulations! User created successfully.");
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = async (userId: string) => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteUsers(userId)).unwrap();
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error(error as string || "Failed to delete user");
      }
    }
  };

  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'unblock' : 'block';
    // const actionPast = currentStatus ? 'Unblocked' : 'Blocked';

    const result = await Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: `This user will be ${action}ed immediately.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#10b981' : '#d33', 
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action} them!`
    });

    if (result.isConfirmed) {
      try {
        await dispatch(toggleBlockUser({ id: userId, isBlocked: currentStatus })).unwrap();
        toast.success(`User ${action}ed successfully!`);
      } catch (error) {
        toast.error(error as string || `Failed to ${action} user`);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="user-management-container">
      
      <div className="page-header">
        <h1>User Management</h1>
        <button className="btn-add-user" onClick={handleOpenAddModal}>
          + Add New User
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {isError && <div className="error-message">{message}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading Users...</div>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="user-info-cell">
                      <div className="user-avatar">
                        {user.profileImage ? (
                            <img 
                                src={`http://localhost:5000${user.profileImage}`} 
                                alt={user.name} 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-user">{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-indicator ${user.isBlocked ? 'status-inactive' : 'status-active'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-icon edit" onClick={() => handleOpenEditModal(user)}>
                        Edit
                      </button>
                      
                      <button 
                        className={`btn-icon ${user.isBlocked ? 'unblock' : 'block'}`} 
                        onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                        style={{ color: user.isBlocked ? 'green' : 'red' }} 
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>

                      <button className="btn-icon delete" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">No users found matching "{searchTerm}"</td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredUsers.length > itemsPerPage && (
            <div className="pagination-container" >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span style={{alignSelf: 'center'}}>
                Page {currentPage} of {totalPages}
              </span>

              <button
              onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <UserModal 
          key={selectedUser ? selectedUser._id : 'add-new'} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
          userToEdit={selectedUser}
        />
      )}
    </div>
  );
}

export default UserManagement;