import MailOutline from "@mui/icons-material/MailOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SocialLogin from "../../components/SocialLogin";
import InputField from "../../components/InputField";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const address =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api/auth/login"
      : "https://api.crypto-pilot.dev/api/auth/login";
  // Check if the user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const verifyResponse = await axiosInstance.get("/auth/verify");
        console.log("User is already logged in:", verifyResponse.data.user);
        // Redirect to the dashboard if authenticated
        navigate(`/dashboard/${verifyResponse.data.user.id}`);
      } catch (error) {
        console.log("User is not logged in, proceeding to login.");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    try {
      console.log("Sending login request...");
      console.log("email:", email);
      console.log("password:", password);
      // Make sure email and password are not empty
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const response = await axiosInstance.post(
        address,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Login successful:", response.data);

      // Verify the token after login
      const verifyResponse = await axiosInstance.get("/auth/verify");
      console.log("User info from verify:", verifyResponse.data.user);

      // Redirect to the dashboard
      navigate(`/dashboard/${verifyResponse.data.user.id}`);
    } catch (err) {
      console.error("Error during login process:", err.response?.data);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <SocialLogin />
      <p className="separator">
        <span>or</span>
      </p>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email address"
          icon={<MailOutline />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          icon={<LockOutlined />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a href="#" className="forgot-password-link">
          Forgot password?
        </a>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account?{" "}
        <a href="/form" className="signup-link">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
