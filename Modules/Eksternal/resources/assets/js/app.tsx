import 'bootstrap/dist/css/bootstrap.css';
import { HashRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import store from './store';

const rootElement = document.getElementById('app')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <HashRouter>
      <Provider store={store}>
        <AppRoutes/>
      </Provider>
    </HashRouter>
  )
}
