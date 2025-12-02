// Contribution #68: "^1.8.14", - Environment configuration
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppKitProvider } from "./config/appkit.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppKitProvider>
    <App />
  </AppKitProvider>
);
