import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import MainLayout from "../Layout/MainLayout";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
]);

export default router;
