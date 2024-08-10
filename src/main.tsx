import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Client from "./Client.tsx";
import Host from "./Host.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./input.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/client" element={<Client />} />
        <Route path="/host" element={<Host />} />
      </Routes>
    </Router>
  </StrictMode>,
);
