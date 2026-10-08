// src/features/auth/components/LoginForm.tsx
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LuEyeOff, LuEye } from "react-icons/lu";

const LoginForm = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    //  Clear the previous error and disable the button
    setError("");
    setIsSubmitting(true);

    try {
      // Call login from AuthContext (it calls the API and sets the user)
      await login({ email, password });

      // Redirect based on role
      //    admin    -> "/admin/dashboard"
      //    employee -> "/chat"
      if (isAuthenticated && user) {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/chat");
      }
    } catch (err) {
      // Show an error message
      //    (wrong credentials, network error, etc.)
      setError("Invalid email or password");
    } finally {
      //  Re-enable the button
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2   text-danger">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className=" font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
          className="h-10 rounded-lg border border-border px-3  outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className=" font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-lg border border-border px-3 pr-14  outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3   text-muted hover:text-heading"
          >
            {showPassword ? <LuEye /> : <LuEyeOff />}
          </button>
        </div>
      </div>

      {/* Remember me + forgot password */}
      <div className="flex items-center justify-between ">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 accent-primary "
          />
          {/* Todo : has to implement later */}
          Remember me
        </label>
        {/* TODO: link to the forgot password page */}
        <a href="#" className="text-primary hover:underline ">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 rounded-lg bg-primary  font-medium text-inverse transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
