import NavBar from "./NavBar";
import Login from "./login";
import DataTable from "./DataTable";
import Profile from "./Profile";
import AddTask from "./addTask";
import UpdateTask from "./UpdateTask";
import User from "./User";
import { useAuth } from "../context/UserContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

  return (
    <>
      <Router>
            <NavBar />
            <Routes>
                <Route 
                    path="/" 
                    element={!user ? <Login name="Login" /> : <DataTable />} 
                />
                <Route path="/tasks" element={<DataTable />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/add" element={<AddTask />} />
                <Route path="/user" element={<User />} />
                <Route path="/update/:taskId" element={<UpdateTask />} />
            </Routes>
        </Router>
    </>
  );
};

export default Home;