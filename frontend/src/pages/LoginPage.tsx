// src/features/auth/pages/LoginPage.tsx
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div data-theme="admin" className="flex min-h-screen">
      {/* Left: brand panel (large screens only) */}
      <div className="hidden w-1/2 flex-col justify-center gap-4 bg-sidebar px-16 text-inverse lg:flex">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-semibold">
          P {/* has to  Use  brand  logo */}
        </div>
        <h1 className="text-3xl font-semibold text-inverse">
          {/* has to change name  */}
          The Policy Expert
        </h1>
        <p className="max-w-sm text-sidebar-text">
          Ask questions. Get answers from your company policies, with sources.
        </p>
      </div>

      {/* Right: form (all screens) */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Brand name for small screens, since the left panel is hidden */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-semibold text-inverse">
              P
            </div>
            <span className="text-lg font-semibold text-heading">
              Policy Expert
            </span>
          </div>

          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mb-6 mt-1 text-sm text-muted">
            Sign in to your account
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account? {/* Todo : link to admin contact  */}
            <span className="text-primary">Contact admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
