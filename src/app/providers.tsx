import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { store } from "./store";
import i18n from "@/i18n";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
}
