// src/pages/BlogList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { blogService } from '@/services/apiService';

// Updated interface to match MongoDB's document structure
interface Blog {
  _id: string;  // Changed from id: number to _id: string to match MongoDB format
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    blogService.getAllBlogs()
      .then(data => {
        // For debugging - log the actual structure of returned data
        console.log('API blog data:', data);
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
      
      {isLoading && <div className="text-center py-4">Loading...</div>}
      
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      
      {!isLoading && !error && blogs.length === 0 && (
        <div className="text-center py-4">No blog posts found.</div>
      )}
      
      {blogs.map(blog => (
        <div key={blog._id} className="mb-6 p-4 border rounded-lg">
          <Link href={`/blogs/${blog._id}`} className="text-xl font-semibold hover:underline">
            {blog.title}
          </Link>
          <p className="text-gray-300 mt-2">{blog.excerpt}</p>
          <small className="text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}