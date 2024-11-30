import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../routes/AuthContext";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginFailMessage, setLoginFailMessage] = useState("");
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  async function formSubmit(data) {
    try {
      await login(data);
      const sessionResponse = await fetch(
        `${apiHost}/api/users/getsession`,
        {
          credentials: "include",
        }
      );

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setUser(sessionData);
        setLoginFailMessage("");
        window.alert("Login successful!");
        navigate("/");
      } else {
        throw new Error("Failed to fetch session data.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data.message) {
        setLoginFailMessage(error.response.data.message);
      } else {
        setLoginFailMessage("Login failed. Please try again.");
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: "260px" }}> 
        <h1 className="text-center">Login</h1>
        {loginFailMessage && (
          <p className="text-danger text-center">{loginFailMessage}</p>
        )}
        <form onSubmit={handleSubmit(formSubmit)} method="post">
          <div className="mb-3">
            <label className="form-label">Email (username)</label>
            <input
              {...register("email", { required: "Email is required." })}
              type="text"
              className="form-control bg-light"
              style={{ width: "100%" }} 
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              {...register("password", { required: "Password is required." })}
              type="password"
              className="form-control bg-light"
              style={{ width: "100%" }} 
            />
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <Link to="/" className="btn btn-outline-dark">
              Cancel
            </Link>
          </div>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link> now.
        </p>
      </div>
    </div>
  );
}
