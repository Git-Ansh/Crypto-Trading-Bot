import MailOutline from "@mui/icons-material/MailOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Name from "@mui/icons-material/Anchor";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SocialLogin from "../../components/SocialLogin";
import InputField from "../../components/InputField";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    try {
      console.log("Signing Up...");
      const response = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Sign-Up successful:", response.data);
      alert("Sign-up successful. Please log in to continue.");
      navigate(`/`);

    } catch (err) {
      if(err.response.status === 400) {
      alert("User already exists. Please log in.");
      navigate(`/`);
      }
      else{
      console.error("Error during Sign-up process:", err);
      alert("Sign-up failed. Please check your credentials and try again.");
    }}
  };

  return (
    <div className="login-container">
      <script src="https://apis.google.com/js/platform.js" async defer></script>
      <h2 className="form-title"> Continue with</h2>
      <SocialLogin />
      <p className="separator">
        <span>or</span>
      </p>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField
          type="username"
          placeholder="User Name"
          icon={<Name />}
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
      <p className="signup-prompt">
        Already have an account?{" "}
        <a href="/" className="signup-link">
          Log In
        </a>
      </p>
    </div>
  );
};

export default SignUp;
