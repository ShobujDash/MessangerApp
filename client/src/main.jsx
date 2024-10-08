import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import "./index.css";

import { SocketProvider } from "./context/SocketContext.jsx";
import { store } from "./redux/store.js";
import router from "./routes/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
