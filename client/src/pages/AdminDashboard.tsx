import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow p-4">
              <nav className="space-y-1">
                <Link href="/admin">
                  <a className={`block px-4 py-2 rounded-md ${location === '/admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/blogs">
                  <a className={`block px-4 py-2 rounded-md ${location === '/admin/blogs' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    Manage Blogs
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className={`block px-4 py-2 rounded-md ${location === '/admin/users' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    Manage Users
                  </a>
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background p-4 rounded-md border">
                  <p className="text-muted-foreground text-sm">Total Blogs</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-background p-4 rounded-md border">
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="bg-background p-4 rounded-md border">
                  <p className="text-muted-foreground text-sm">Comments</p>
                  <p className="text-2xl font-bold">48</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Link href="/admin/blogs/create">
                  <a className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Create New Blog
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;