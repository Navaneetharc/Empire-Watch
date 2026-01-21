import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, {IUser} from '../models/User';
import generateToken from '../utils/generateToken';
import path  from 'path';

interface AuthRequest extends Request {
  user?: IUser; 
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing fields");
      return res.status(400).json({ message: 'Please add all fields' });
    }

    console.log("Checking if user exists...");
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = "";
    if(req.file){
      profileImage = `/${req.file.path.replace(/\\/g,"/")}`;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });

    if (user) {
      console.log("User created! Sending response.");
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(res, user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, isBlocked } = req.body;

    const updateData : any = {name, email, role, isBlocked};

    if(req.file){
      updateData.profileImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } 
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      if (user.isBlocked) {
        return res.status(403).json({ 
          message: 'Access Denied MWONEEE, Your account has been blocked by the administrator.' 
        });
      }
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(res, user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });  
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async(req: Request, res: Response) => {
  const {email, password} = req.body;

  if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

    res.status(200).json({
      _id: 'admin_id',
      name: 'Global Administrator',
      email: email,
      role: 'admin',
      token: generateToken(res, 'admin-id-001',"admin"),
    });
  }else{
    res.status(401).json({message: 'Invalid Admin Credentials'});
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfileImage = async(req: Request, res: Response) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/${req.file.path.replace(/\\/g, "/")}`;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {profileImage: imagePath},
      {new: true}
    ).select('-password');

    res.json(user);
  } catch (error) {

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({message: errorMessage});
  }
}

export const getMe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest; 
  res.status(200).json(authReq.user);
}