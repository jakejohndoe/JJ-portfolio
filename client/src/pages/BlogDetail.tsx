import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

const BlogDetail = () => {
  // Get blog ID from URL
  const [match, params] = useRoute("/blogs/:id");
  const blogId = params?.id;
  
  // Fetch blog details
  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: [`/api/blogs/${blogId}`],
    enabled: !!blogId, // Only run query if blogId exists
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading blog post. Please try again later.
          </div>
          <div className="mt-4">
            <Link href="/blogs">
              <a className="text-primary hover:underline">← Back to blog list</a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/blogs">
            <a className="text-primary hover:underline">← Back to blog list</a>
          </Link>
        </div>
        
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="mb-4">{blog.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-6">
            <span className="mr-4">{blog.author}</span>
            <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          
          {blog.imageUrl && (
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full rounded-lg mb-6 aspect-video object-cover" 
            />
          )}
          
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;