import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import "./App.css";

interface LoginProps {
  onSignupClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onSignupClick }) => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [error, setError] = useState<string>("");

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    const formData = new FormData();
    formData.append("username", target.username.value);
    formData.append("password", target.password.value);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      await fetchUser({
        userId: response.data.id,
        accessToken: response.data.accessToken,
      });
      navigate("/topicsWorld");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-container">
      <div className="card login-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="company-title">T@pics</h1>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                required
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary btn-lg">
                Sign In
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <a href="#" className="text-decoration-none">
                Forgot your password?
              </a>
              <button
                type="button"
                onClick={onSignupClick}
                className="btn btn-outline-primary"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;