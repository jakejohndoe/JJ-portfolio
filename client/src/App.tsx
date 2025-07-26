import { Switch, Route, Redirect } from "wouter";
import Home from "@/pages/Home";
import SimpleHome from "@/pages/SimpleHome";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBlogList from "@/pages/AdminBlogList";
import BlogCreation from "@/pages/BlogCreation";
import BlogEdit from "@/pages/BlogEdit";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/not-found";
import SpotlightCursor from "@/components/CustomCursor";
import ProtectedRoute from "@/components/ProtectedRoute";
import MatrixRain from "@/components/MatrixRain";
import FloatingCodeElements from "@/components/FloatingCodeElements";
import InteractiveParticles from "@/components/InteractiveParticles";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Blog routes */}
        <Route path="/blogs" component={BlogList} />
        <Route path="/blogs/:id" component={BlogPost} />
        
        {/* Redirect /blog to /blogs */}
        <Route path="/blog">
          {() => {
            window.location.href = "/blogs";
            return null;
          }}
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        
        {/* Protected admin routes */}
        <Route path="/admin">
          {() => (
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/blogs">
          {() => (
            <ProtectedRoute>
              <AdminBlogList />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/blogs/create">
          {() => (
            <ProtectedRoute>
              <BlogCreation />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/blogs/edit/:id">
          {() => (
            <ProtectedRoute>
              <BlogEdit />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/admin/users">
          {() => (
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;