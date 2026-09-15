import { useState } from "react";
import type { SyntheticEvent } from "react";
import "./Admin.css";

const API_URL = "http://localhost:5000";

function Admin() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiKey.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          apiKey: apiKey.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to login."
        );
      }

      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">M</div>

        <h1>Manimaran Admin</h1>

        <p className="admin-login-subtitle">
          Project Inquiry Manager
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-key">
            Admin Key
          </label>

          <input
            id="admin-key"
            type="password"
            value={apiKey}
            onChange={(event) =>
              setApiKey(event.target.value)
            }
            placeholder="Enter your admin key"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <a
          className="admin-back-link"
          href="/"
        >
          ← Back to Portfolio
        </a>
      </div>
    </div>
  );
}

export default Admin;