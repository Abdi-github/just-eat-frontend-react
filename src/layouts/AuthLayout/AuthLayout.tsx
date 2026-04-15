import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <img src="/logo.svg" alt="just-eat.ch" className="h-10" />
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
