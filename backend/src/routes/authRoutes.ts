import express from 'express';
import { 
    registerUser, 
    loginUser, 
    adminLogin, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    blockUser, 
    unblockUser,
    getMe 
} from '../controllers/authController';
import upload from '../middleware/uploadMiddleware';
import { uploadProfileImage } from '../controllers/authController';


import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);

router.get('/me', protect, getMe);

// image upload route

router.put('/users/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Admin Routes
router.get('/users', getAllUsers);
router.post('/users',upload.single('profileImage'),registerUser); 
router.put('/users/:id',upload.single('profileImage'), updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);

export default router;