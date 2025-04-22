import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import BlogCreation from "@/pages/BlogCreation";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blogs" component={BlogList} />
      <Route path="/blogs/:id" component={BlogDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/blogs/create" component={BlogCreation} />
      <Route path="/admin/users" component={UserManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;