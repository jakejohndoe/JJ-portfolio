import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDistance } from "date-fns";

// Define blog type
interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

const BlogList = () => {
  // Fetch blogs from API
  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading blogs. Please try again later.
          </div>
        )}
        
        {blogs && blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`}>
              <a className="block group">
                <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {blog.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{blog.author}</span>
                      <span>{formatDistance(new Date(blog.createdAt), new Date(), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogList;