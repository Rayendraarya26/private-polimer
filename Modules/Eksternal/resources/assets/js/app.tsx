import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { HashRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';

const rootElement = document.getElementById('app')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <HashRouter>
      <AppRoutes/>
    </HashRouter>
  )
}
