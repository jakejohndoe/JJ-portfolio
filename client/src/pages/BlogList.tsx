// src/components/BlogList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'wouter';

type Blog = {
  _id: string;
  title: string;
  excerpt: string;
  createdAt: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(setBlogs);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
      {blogs.map(blog => (
        <div key={blog._id} className="mb-6 p-4 border rounded-lg">
          <Link href={`/blog/${blog._id}`} className="text-xl font-semibold hover:underline">
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