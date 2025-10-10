import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "@/components/SignupForm";

const Register: React.FC = () => {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <SignupForm />
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "blue" }}>Log In</Link>
      </p>
    </div>
  );
};

export default Register;
