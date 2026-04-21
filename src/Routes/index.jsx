import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import MainLayout from "../Layout/MainLayout";
import Register from "../Pages/Register";
import RequestOTP from "../Pages/RequestOTP";
import VerifyOTP from "../Pages/VerifyOTP";
import ResetPassword from "../Pages/ResetPassword";

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
        path: "request-otp",
        element: <RequestOTP />,
      },

      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },

      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

export default router;
