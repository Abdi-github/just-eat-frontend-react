import { Component, type ErrorInfo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Ignore DOM mutation errors caused by browser extensions
    if (error.name === "NotFoundError" && error.message.includes("removeChild")) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silence DOM mutation errors caused by browser extensions
    if (error.name === "NotFoundError" && error.message.includes("removeChild")) {
      return;
    }
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle size={32} className="text-error" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {t("errors.boundaryTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("errors.boundaryMessage")}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw size={14} className="mr-2" />
            {t("actions.retry")}
          </Button>
          <Button onClick={() => (window.location.href = "/")} size="sm">
            <Home size={14} className="mr-2" />
            {t("nav.home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
