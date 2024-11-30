import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signupErrorMessage, setSignupErrorMessage] = useState(""); // Store signup error messages
  const navigate = useNavigate();

  // Handle form submission
  async function formSubmit(data) {
    const url = `${import.meta.env.VITE_API_HOST}/api/users/signup`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.alert("Signup successful! You can now log in.");
        navigate("/login"); // Redirect to the login page
      } else {
        const errorText = await response.text();
        setSignupErrorMessage(errorText); 
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setSignupErrorMessage("Signup failed: Unable to connect to the server.");
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: "360px" }}>
        <h1 className="text-center">Signup</h1>
        {signupErrorMessage && (
          <p className="text-danger text-center">{signupErrorMessage}</p>
        )}
        <form onSubmit={handleSubmit(formSubmit)} method="post">
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              {...register("firstName", { required: true })}
              type="text"
              className="form-control bg-light"
            />
            {errors.firstName && (
              <span className="text-danger">{errors.firstName.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              {...register("lastName", { required: "Last Name is required." })}
              type="text"
              className="form-control bg-light"
            />
            {errors.lastName && (
              <span className="text-danger">{errors.lastName.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Email (username)</label>
            <input
              {...register("email", { required: "Email is required." })}
              type="email"
              className="form-control bg-light"
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
            />
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Signup
            </button>
            <Link to="/login" className="btn btn-outline-dark">
              Cancel
            </Link>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login">Log in now</Link>.
        </p>
      </div>
    </div>
  );
}
