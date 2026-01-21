import React, { useState } from 'react'; 
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { validateUserForm } from '../../../utils/validation';
import './UserModal.css';

interface UserData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  profileImage?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; 
  userToEdit?: UserData | null;
}

interface ValidationError{
  name?: string;
  email?: string;
  password?: string;
}

const UserModal: React.FC<UserModalProps> = ({ onClose, onSubmit, userToEdit }) => {
  
  const [formData, setFormData] = useState<UserData>({
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    password: '',
    role: userToEdit?.role || 'user',
    profileImage: userToEdit?.profileImage || '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<ValidationError>({});
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if(errors[e.target.name as keyof ValidationError]){
      setErrors({...errors, [e.target.name]: null});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateUserForm(
      {name: formData.name, email: formData.email, password: formData.password},!!userToEdit
    );

    if(errorMessage){
      toast.error(errorMessage);
      return;
    }

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('role', formData.role || 'user');
    
    if (formData.password) {
      submissionData.append('password', formData.password);
    }

    if (selectedFile) {
      submissionData.append('profileImage', selectedFile);
    }

    onSubmit(submissionData);
    onClose();
  };

  const getProfileImageSrc = () => {
    if (selectedFile) {
        return URL.createObjectURL(selectedFile); 
    }
    if (formData.profileImage) {
        return `http://localhost:5000${formData.profileImage}`; 
    }
    return null;  
  };

  const imageSrc = getProfileImageSrc();

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header">
          <h2>{userToEdit ? 'Edit User' : 'Add New User'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt="Profile Preview" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <FaUserCircle size={100} color="#ccc" />
                )}
            </div>
            <label className="btn-upload" style={{ cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}>
                {selectedFile ? "Change Photo" : "Upload Photo"}
                <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
             <label htmlFor="password">
                Password {userToEdit && <span style={{fontWeight:'normal', fontSize:'0.8em'}}>(Leave blank to keep current)</span>}
             </label>
             <input
               type="password"
               id="password"
               name="password"
               value={formData.password}
               onChange={handleChange}
               placeholder={userToEdit ? "New password (optional)" : "Create a password"}
             />
           </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Regular User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">{userToEdit ? 'Update User' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;