import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth.tsx";
import { Wrapper } from "./components/Wrapper.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Wrapper>
          <App />
        </Wrapper>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
