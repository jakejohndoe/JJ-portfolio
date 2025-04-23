import mongoose from 'mongoose';

interface BlogDocument extends mongoose.Document {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BlogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema);
export default Blog;