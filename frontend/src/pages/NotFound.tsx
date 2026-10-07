// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go home
      </Link>
    </div>
  );
}
