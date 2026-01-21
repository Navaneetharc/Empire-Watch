import React, {  useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './ProfileModal.css';
import { toast } from 'react-toastify';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    currentImage?: string | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onUpload ,currentImage}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            onClose();
            toast.success("Congratulations! You got a face now")
        } else {
            toast.error("Please select a file first");
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal-container'>
                <div className='modal-header'>
                    <h2>Update Profile Picture</h2>
                    <button className='close-btn' onClick={onClose}>&times;</button>
                </div>

                <div className='modal-form'>
                    <div className='preview-container' style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        {selectedFile ? (
                            <img 
                                src={URL.createObjectURL(selectedFile)} 
                                alt="Preview" 
                                className='preview-image'
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ): currentImage ? (
                            <img 
                                src={currentImage} 
                                alt="Current Profile" 
                                className='preview-image'
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ):(
                            <FaUserCircle size={150} color="#ccc" />
                        )}
                    </div>

                    <div className='form-group'>
                        <label>Choose Profile Picture</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept='image/*'
                            className='file-input'
                        />
                    </div>
                </div>

                <div className='modal-footer'>
                    <button className='btn-cancel' onClick={onClose}>Cancel</button>
                    <button className='btn-save' onClick={handleSubmit} disabled={!selectedFile}>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;