import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../routes/AuthContext"; // Import AuthContext for state management

const apiHost = import.meta.env.VITE_API_HOST;

export default function Logout() {
  const [status, setStatus] = useState("Logging out...");
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Update user state in AuthContext

  useEffect(() => {
    async function logout() {
      try {
        const url = `${apiHost}/api/users/logout`;
        const response = await fetch(url, {
          method: "POST",
          credentials: "include", // Ensure cookies are included for session handling
        });

        if (response.ok) {
          // Clear user state in AuthContext
          setUser(null);

          // Update status and navigate to homepage after delay
          setStatus("You have been successfully logged out.");
          setTimeout(() => {
            navigate("/"); 
          }, 2000);
        } else {
          // Handle failure
          setStatus("Error logging out. Please try again.");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        setStatus("Error logging out. Please try again.");
      }
    }

    logout();
  }, [navigate, setUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logout</h1>
      <p>{status}</p>
    </div>
  );
}
