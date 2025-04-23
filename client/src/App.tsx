import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AdminDashboard from "@/pages/AdminDashboard";
import BlogCreation from "@/pages/BlogCreation";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/not-found";
import SpotlightCursor from "@/components/CustomCursor"; 

function App() {
  return (
    <>
      <SpotlightCursor /> {/* 👈 Tracker rendered above the router */}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blogs" component={BlogList} />
        <Route path="/blogs/:id" component={BlogPost} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/blogs" component={BlogList} /> {/* Admin blogs listing */}
        <Route path="/admin/blogs/create" component={BlogCreation} />
        <Route path="/admin/users" component={UserManagement} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
