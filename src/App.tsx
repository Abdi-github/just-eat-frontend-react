import { AppProviders } from "@/app/providers";
import { AppRoutes } from "@/routes";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ScrollToTop } from "@/shared/components/ScrollToTop";

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <ScrollToTop />
        <AppRoutes />
      </ErrorBoundary>
    </AppProviders>
  );
}
