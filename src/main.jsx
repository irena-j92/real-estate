import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./experience.css";
import "./mosaicist.css";
import "./refinements.css";
import "./navigation-polish.css";
import "./layout-refinements.css";
import "./brand-refinements.css";
import "./final-polish.css";
import "./editorial-refinements.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
