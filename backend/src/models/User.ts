import mongoose,{Document, Schema} from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isBlocked: boolean;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, 
    isBlocked: {
    type: Boolean,
    default: false, 
  },
    profileImage: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        // profileImage?: string;
    },
},{
    timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
