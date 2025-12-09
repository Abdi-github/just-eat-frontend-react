import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-primary">just-eat</span>
            <span className="text-lg text-muted-foreground">.ch</span>
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
