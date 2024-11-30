import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();
const apiHost = import.meta.env.VITE_API_HOST;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  
  const fetchSession = async () => {
    try {
      const response = await axios.get(`${apiHost}/api/users/getsession`, { withCredentials: true });
      if (response.status === 200 && response.data) {
        setUser(response.data); 
      } else {
        setUser(null); 
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("No active session, user not logged in.");
        setUser(null); 
      } else {
        console.error("Error fetching session:", error);
      }
    } finally {
      setLoading(false); 
    }
  };

  
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${apiHost}/api/users/login`, credentials, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        setUser(response.data); 
        console.log("Login successful:", response.data);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // 
    }
  };

 
  const logout = async () => {
    try {
      await axios.post(`${apiHost}/api/users/logout`, {}, { withCredentials: true });
      setUser(null); 
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
