import process from "process/browser";

// Polyfill process.cwd for browser compatibility
if (typeof window !== "undefined") {
  (window as any).process = process;
  if (!process.cwd) {
    process.cwd = () => "/";
  }
}

import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { App } from "./App";
import "./index.css";
import "swagger-ui-react/swagger-ui.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);
