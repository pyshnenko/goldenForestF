import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import { AuthProvider } from "hooks/useAuth";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StyledEngineProvider>
  </BrowserRouter>
);
