import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { signOut } from "./auth";

export default function AuthButton() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) return null;

  if (user && profile?.username) {
    return (
      <div className="navAuth">
        <span className="userPill">{profile.username}</span>

        <button className="logoutBtn" onClick={signOut}>
          Logout
        </button>
      </div>
    );
  }

  if (user && !profile?.username) {
    return null;
  }

  return (
    <div className="navAuth">
      <button
        className="loginBtn"
        onClick={() => navigate("/login")}
      >
        Login
      </button>

      <button
        className="registerBtn"
        onClick={() => navigate("/register")}
      >
        Register
      </button>
    </div>
  );
}
