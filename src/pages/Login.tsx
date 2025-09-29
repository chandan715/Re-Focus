import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <LoginForm onLoginSuccess={() => navigate("/profile")} />
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "blue" }}>Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
