import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./navigation";
import ErrorBoundary from "./pages/utils/ErrorBoundary";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ToastProvider } from "./contexts/ToastContext";
import { Toaster } from "sonner";
import { DiningExperienceProvider } from "./contexts/DiningExperienceContext";
import { DiningPreferencePrompt } from "./contexts/DiningPromptContext";
import { DiningGroupView } from "./contexts/GroupDiningView";
function App() {
  return (
    <>
      <ErrorBoundary>
        <Provider store={store}>
          <ToastProvider>
            <LoadingProvider>
              <AuthProvider>
                <DiningExperienceProvider>
                  <DiningPreferencePrompt />
                  <DiningGroupView />
                  <Navigation />
                </DiningExperienceProvider>
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </Provider>
        <Toaster position="top-center" />
      </ErrorBoundary>
    </>
  );
}

export default App;
