import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { signInWithGoogle, signOut } from "./auth";
import LoginPage from "./components/LoginPage";

export default function AuthButton() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [showAuth, setShowAuth] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        loadProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUser() {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (currentUser) {
      await loadProfile(currentUser);
    }
  }

  async function loadProfile(currentUser) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Profile error:", error.message);
      return;
    }

    setProfile(data);
  }

  // =========================
  // CREATE ACCOUNT
  // =========================

  async function createAccount() {
    if (!username.trim() || !password) {
      setMessage("Username va password kiriting.");
      return;
    }

    if (username.trim().length < 3) {
      setMessage("Username kamida 3 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password kamida 6 ta belgidan iborat bo‘lsin.");
      return;
    }

    setLoading(true);
    setMessage("");

    const cleanUsername = username.trim().toLowerCase();

    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (checkError) {
      console.error("Username check error:", checkError);
    }

    if (existing) {
      setMessage("Bu username band.");
      setLoading(false);
      return;
    }

    const hiddenEmail = `${cleanUsername}@cydefora.local`;

    const { data, error } = await supabase.auth.signUp({
      email: hiddenEmail,
      password: password,
    });

    if (error) {
      console.error("Signup error:", error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("Account yaratilmadi.");
      setLoading(false);
      return;
    }

    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email: hiddenEmail,
        username: cleanUsername,
        full_name: "",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      setMessage("Profile yaratishda xatolik.");
      setLoading(false);
      return;
    }

    setUser(data.user);
    setProfile(newProfile);

    setUsername("");
    setPassword("");
    setMessage("");
    setShowAuth(false);

    setLoading(false);
  }

  // =========================
  // OLD LOGIN FUNCTION
  // Hozir yangi LoginPage ishlatadi
  // =========================

  async function loginWithUsername() {
    if (!username.trim() || !password) {
      setMessage("Username va password kiriting.");
      return;
    }

    setLoading(true);
    setMessage("");

    const cleanUsername = username.trim().toLowerCase();

    const { data, error: rpcError } = await supabase.rpc(
      "get_email_by_username",
      {
        username_input: cleanUsername,
      }
    );

    if (rpcError) {
      console.error("RPC error:", rpcError);
      setMessage("Accountni topishda xatolik.");
      setLoading(false);
      return;
    }

    if (!data) {
      setMessage("Bunday account mavjud emas.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setMessage("Username yoki password noto‘g‘ri.");
      setLoading(false);
      return;
    }

    setUsername("");
    setPassword("");
    setMessage("");
    setShowAuth(false);

    setLoading(false);
  }

  // =========================
  // GOOGLE ACCOUNT
  // =========================

  async function finishGoogleAccount() {
    if (!username.trim() || !password) {
      setMessage("Username va password kiriting.");
      return;
    }

    if (username.trim().length < 3) {
      setMessage("Username kamida 3 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password kamida 6 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (!user) return;

    setLoading(true);
    setMessage("");

    const cleanUsername = username.trim().toLowerCase();

    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (checkError) {
      console.error("Username check error:", checkError);
    }

    if (existing && existing.id !== user.id) {
      setMessage("Bu username band.");
      setLoading(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    });

    if (passwordError) {
      console.error("Password error:", passwordError);
      setMessage(passwordError.message);
      setLoading(false);
      return;
    }

    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    setProfile(updatedProfile);

    setUsername("");
    setPassword("");
    setMessage("");
    setShowAuth(false);

    setLoading(false);
  }

  // =========================
  // LOGGED IN USER
  // =========================

  if (user) {
    // Google orqali birinchi marta kirgan
    if (!profile?.username) {
      return (
        <div className="auth-panel">
          <h3>Complete your Cydefora account</h3>

          <p>Username va password o‘rnating.</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && <p>{message}</p>}

          <button
            className="secondary"
            onClick={finishGoogleAccount}
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </button>

          <button className="secondary" onClick={signOut}>
            Logout
          </button>
        </div>
      );
    }

    return (
      <>
        <span>{profile.username}</span>

        <button className="secondary" onClick={signOut}>
          Logout
        </button>
      </>
    );
  }

  // =========================
  // LOGGED OUT
  // =========================

  return (
    <>
      {/* YANGI CYBER LOGIN PAGE */}
      {showLoginPage && (
        <LoginPage
          onClose={() => setShowLoginPage(false)}
        />
      )}

      {/* LOGIN */}
      <button
        className="secondary"
        onClick={() => setShowLoginPage(true)}
      >
        Login
      </button>

      {/* CREATE ACCOUNT */}
      <button
        className="secondary"
        onClick={() => {
          setMode("register");
          setShowAuth(true);
          setMessage("");
        }}
      >
        Create Account
      </button>

      {/* GOOGLE */}
      <button
        className="secondary"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>

      {/* OLD CREATE ACCOUNT PANEL */}
      {showAuth && (
        <div className="auth-panel">
          <h3>Create your Cydefora account</h3>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && <p>{message}</p>}

          <button
            className="secondary"
            onClick={createAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p>
            Already have an account?{" "}
            <button
              onClick={() => {
                setShowAuth(false);
                setShowLoginPage(true);
                setMessage("");
              }}
            >
              Login
            </button>
          </p>
        </div>
      )}
    </>
  );
}