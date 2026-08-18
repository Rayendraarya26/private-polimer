import './styles/app.css';
import { HashRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { Toaster } from 'react-hot-toast';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const rootElement = document.getElementById('app')
// get value from meta data-recaptcha-site-key
const meta = document.querySelector('meta[name="recaptcha-site-key"]')
const RECAPTCHA_SITE_KEY = meta?.getAttribute('content')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <HashRouter>
      <Provider store={store}>
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY as string}>
          <AppRoutes/>
          <Toaster />
        </GoogleReCaptchaProvider>
      </Provider>
    </HashRouter>
  )
}
