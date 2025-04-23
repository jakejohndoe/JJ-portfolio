import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the base User interface
interface IUserBase {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

// 2. Document interface (extends both IUserBase and mongoose.Document)
export interface IUserDocument extends IUserBase, mongoose.Document {
  matchPassword(password: string): Promise<boolean>;
}

// 3. Model interface
interface IUserModel extends mongoose.Model<IUserDocument> {}

// 4. Create the Schema
const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true // Explicitly enable _id
});

// 5. Password hashing middleware
UserSchema.pre<IUserDocument>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 6. Instance method for password comparison
UserSchema.methods.matchPassword = async function(
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 7. Create and export the model
const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;

// 8. Export types separately without duplicates
export type { IUserDocument as UserDocument };
export type { IUserModel as UserModel };
export type { IUserBase as User };