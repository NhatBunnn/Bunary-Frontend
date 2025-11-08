import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import CreateWordSet from "../pages/CreateWordSet";
import Homepage from "@pages/Homepage/Homepage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import HeaderOnly from "../layouts/HeaderOnly";
import {
  Collection,
  CollectionDetail,
  EditWordset,
  Learning,
} from "@pages/index";
import WordSetPage from "@pages/WordSetPage/WordSetPage";
import AdminHome from "@pages/AdminDashboard/AdminHome/AdminHome";
import AdminLayout from "@layouts/AdminLayout/AdminLayout";
import NotFound from "@pages/FallBack/NotFound/NotFound";
import Forbidden from "@pages/FallBack/Forbidden/Forbidden";
import UserDashboard from "@pages/AdminDashboard/UserDashboard/UserDashboard";
import WordSetDashboard from "@pages/AdminDashboard/WordSetDashboard/WordSetDashboard";

const publicRoutes = [
  { path: "/", Page: Homepage, Layout: DefaultLayout },
  { path: "/:slug", Page: Homepage, Layout: DefaultLayout },
  { path: "/login", Page: Login },
  { path: "/register", Page: Register },
  { path: "/verify-email", Page: VerifyEmail },
  { path: "/wordset/:id/:slug", Page: WordSetPage, Layout: DefaultLayout },

  {
    path: "/collection/:id/wordsets",
    Page: CollectionDetail,
    Layout: DefaultLayout,
  },

  // FallBack
  { path: "/*", Page: NotFound },
  { path: "/404", Page: NotFound },
  { path: "/403", Page: Forbidden },
];

const privateRoutes = [
  { path: "/createwordset", Page: CreateWordSet, Layout: DefaultLayout },
  { path: "/profile", Page: Profile, Layout: DefaultLayout },
  { path: "/setting", Page: Setting, Layout: DefaultLayout },
  { path: "/collection", Page: Collection, Layout: DefaultLayout },
  { path: "/wordset/:id/edit", Page: EditWordset, Layout: DefaultLayout },
  { path: "/learning/:id/:mode", Page: Learning, Layout: HeaderOnly },
];

const adminRoutes = [
  {
    path: "/admin",
    Page: AdminHome,
    Layout: AdminLayout,
    roles: ["ADMIN"],
  },
  {
    path: "/admin/user",
    Page: UserDashboard,
    Layout: AdminLayout,
    roles: ["ADMIN"],
  },

  {
    path: "/admin/wordset",
    Page: WordSetDashboard,
    Layout: AdminLayout,
    roles: ["ADMIN"],
  },
];

export { publicRoutes, privateRoutes, adminRoutes };
