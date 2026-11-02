import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import logo from "./assets/oviaLogo.jpg";

const favicon = document.querySelector("link[rel='icon']");

if (favicon) {
  favicon.setAttribute("href", logo);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
