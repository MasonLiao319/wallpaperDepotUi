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

          // Update status
          setStatus("You have been successfully logged out.");
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
  }, [setUser]);

  return (
    <div className="d-flex justify-content-center align-items-center">
    <div >
      <h1 className="mb-4">Logout</h1>
      <p className="mb-4">{status}</p>
      {status === "You have been successfully logged out." && (
        <div>
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-primary me-3"
              onClick={() => navigate("/login")}
            >
              Go to Login Page
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Go to Home Page
            </button>
          </div>
        </div>
        
      )}
    </div>
    </div>
  );
}
