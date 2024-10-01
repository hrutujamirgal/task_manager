import { useAuth } from "../context/UserContext";
import {useNavigate} from 'react-router-dom'

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate()

    const handleTasks = () => {
        navigate("/")
    };

    const handleProfile = () => {
        navigate(`/profile/${user.id}`)
    };

    const handleUser = () => {
        navigate("/user")
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="mt-0 h-20 bg-veryLightBlue flex flex-row items-center">
            <h1 className="text-midnight text-3xl font-serif font-extrabold hover:cursor-pointer mt-5">
                Task Manager {user ? `, ${user.name}` : ''}
            </h1>

            <ul className="list-none flex flex-row px-2 py-2 space-x-4 mt-4 ml-auto">
                {user ? (<>
                    <li
                    className="text-midnight text-xl font-serif hover:cursor-pointer"
                    onClick={handleTasks}
                >
                    <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white"> 
                        Tasks
                    </span>
                </li>

                {user && user.status === 'Admin'?(<>
                    <li className="text-midnight text-xl font-serif hover:cursor-pointer" onClick={handleUser}>
                    <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white">
                        User
                    </span>
                </li>
                    <li className="text-midnight text-xl font-serif hover:cursor-pointer" onClick={handleProfile}>
                    <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white">
                        Profile
                    </span>
                </li>
                </>):(<>
                    <li className="text-midnight text-xl font-serif hover:cursor-pointer" onClick={handleProfile}>
                    <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white">
                        Profile
                    </span>
                </li>
                </>)}
                
                {user && (
                    <li className="text-red text-xl font-serif hover:cursor-pointer" onClick={handleLogout}>
                        <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white">
                            Logout
                        </span>
                    </li>
                )}
                </>):(<>
                    <li
                    className="text-midnight text-xl font-serif hover:cursor-pointer"
                    onClick={handleTasks}
                >
                    <span className="py-2 px-2 transition duration-300 ease-in-out hover:text-white"> 
                        Login
                    </span>
                </li>
                </>)}

            </ul>
        </nav>
    );
};

export default NavBar;
