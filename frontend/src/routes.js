import LoginPage from "views/Pages/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import VerifyEmailPage from "views/Pages/VerifyEmailPage.js";
import RecoverPassword from "views/Pages/RecoverPass.js";
import ResetPassword from "views/Pages/ResetPass.js";
import Dashboard from "views/Pages/Dashboard.js";
import ProjectDetail from "views/Pages/ProjectDetail.js";
import Landing from "views/Pages/Landing";

var dashRoutes = [
  {
    path: "/login",
    name: "Login Page",
    component: LoginPage,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register Page",
    component: RegisterPage,
    layout: "/auth"
  },
  {
    path: "/resetpass",
    name: "Recover Password",
    component: RecoverPassword,
    layout: "/auth"
  },
  {
    path: "/new-password/:userId/:hash",
    name: "Reset Password",
    component: ResetPassword,
    layout: "/auth"
  },
  {
    path: "/landing",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/projectdetail",
    name: "Project Detail",
    component: ProjectDetail,
    layout: "/admin"
  },
  {
    path: "/verify-email/:userId",
    name: "Verify Email Page",
    component: VerifyEmailPage,
    layout: "/auth"
  }
];
export default dashRoutes;
