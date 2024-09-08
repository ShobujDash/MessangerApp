import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MessagePage from "../components/MessagePage";
import AuthLayouuts from "../layout";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Forgotpasword from "../pages/Forgotpasword";
import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AuthLayouuts>
            <RegisterPage />
          </AuthLayouuts>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayouuts>
            <CheckEmailPage />
          </AuthLayouuts>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayouuts>
            <CheckPasswordPage />
          </AuthLayouuts>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayouuts>
            <Forgotpasword />
          </AuthLayouuts>
        ),
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
