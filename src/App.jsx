import React from "react";
import NavBar from "./ui/NavBar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./routes/AuthContext"; 


export default function App() {
  return (
    <div>
      <AuthProvider>
      <NavBar />
      <Outlet />
      </AuthProvider>
    </div>
  );
}
