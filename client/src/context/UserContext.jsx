/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';
import {  notification } from "antd";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [all, setAll] = useState([]);
  const route = `http://localhost:5000/api/user`;

    const login = async (username, password) => {
      try {
        const response = await fetch(`${route}/login`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ username, password })
        });
  
        const data = await response.json(); 
  
        if (response.ok) {
          const { userId, userStatus, name} = data;
          setUser({ id: userId, status: userStatus, name:name });
          notification.success({
            message: "Login Successfully",
          });
        } else {
          notification.error({
            message: "Login Failed!",
          });
        }
      } catch (e) {
        console.error("Error during login:", e);
        notification.error({
          message: "Error in login",
        });
      }
    };

  const logout = () => {
    setUser(null);
    notification.success({
      message: "Logout Successfull.",
    });
  };

  const register = async (username, password) => {
    try {
      const response = await fetch(`${route}/register`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        
        const { userId, userStatus,  name } = data;
        setUser({ id: userId, status: userStatus, name:name });
        notification.success({
          message: "Regitration Successfully",
        });
      } else {
        notification.error({
          message: "Registration failed!",
        });
      }
    } catch (e) {
      console.error("Error during registration:", e);
      notification.error({
        message: "Error in Registration.",
      });
    }
  };


  const allUser = async () => {
    try {
      const response = await fetch(`${route}/getAll`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setAll(data)
      } 
    } catch (e) {
      console.error("Error in fetching usernames:", e);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, allUser, all }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
