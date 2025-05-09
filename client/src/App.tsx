import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/AdminLogin"; // Add this import
import AdminDashboard from "@/pages/AdminDashboard";
import BlogCreation from "@/pages/BlogCreation";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/not-found";
import SpotlightCursor from "@/components/CustomCursor"; 

function App() {
  return (
    <>
      <SpotlightCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blogs" component={BlogList} />
        <Route path="/blogs/:id" component={BlogPost} />
        <Route path="/admin/login" component={AdminLogin} /> {/* Add this route */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/blogs" component={BlogList} />
        <Route path="/admin/blogs/create" component={BlogCreation} />
        <Route path="/admin/users" component={UserManagement} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;