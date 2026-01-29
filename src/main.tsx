import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Render the app with BrowserRouter already wrapped in App.tsx
createRoot(document.getElementById("root")!).render(<App />);
