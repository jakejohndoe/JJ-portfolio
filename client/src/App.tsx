import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import BlogCreation from "@/pages/BlogCreation";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/not-found";
import SpotlightCursor from "@/components/CustomCursor";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <>
      <SpotlightCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blogs" component={BlogList} />
        <Route path="/blogs/:id" component={BlogPost} />
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
              <BlogList />
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