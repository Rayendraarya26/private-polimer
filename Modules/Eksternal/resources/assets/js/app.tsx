import './styles/app.css';
import { HashRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { Toaster } from 'react-hot-toast';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionProvider } from './context/PermissionContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

const rootElement = document.getElementById('app')
// get value from meta data-recaptcha-site-key
const meta = document.querySelector('meta[name="recaptcha-site-key"]')
const RECAPTCHA_SITE_KEY = meta?.getAttribute('content')

if (rootElement) {
  const root = createRoot(rootElement)
  const isRecaptchaValid = Boolean(
    RECAPTCHA_SITE_KEY &&
    RECAPTCHA_SITE_KEY.trim() !== '' &&
    RECAPTCHA_SITE_KEY !== '6Le_' &&
    RECAPTCHA_SITE_KEY.length > 10
  );

  const content = (
    <PermissionProvider>
      <AppRoutes/>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!rounded-xl !shadow-lg !border !border-slate-200/80 !text-xs !font-medium !text-slate-800 !p-3.5 !bg-white",
          duration: 4000,
          success: {
            iconTheme: {
              primary: "#059669",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#E11D48",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </PermissionProvider>
  );

  root.render(
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Provider store={store}>
          {isRecaptchaValid ? (
            <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY as string}>
              {content}
            </GoogleReCaptchaProvider>
          ) : (
            content
          )}
        </Provider>
      </HashRouter>
    </QueryClientProvider>
  )
}
