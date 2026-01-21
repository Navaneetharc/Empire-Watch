import mongoose, { Document, Schema } from 'mongoose';

interface IGoal extends Document {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
}

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGoal>('Goal', goalSchema);