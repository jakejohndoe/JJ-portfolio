// client/src/components/BlogPost.tsx
import React from "react";

interface BlogPostProps {
  title: string;
  author: string;
  date: string;
  content: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, author, date, content }) => {
  return (
    <article className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        By {author} · {new Date(date).toLocaleDateString()}
      </p>
      <div className="mt-4 text-gray-800 dark:text-gray-200 leading-relaxed">
        {content}
      </div>
    </article>
  );
};

export default BlogPost;
