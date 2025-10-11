import DefaultLayout from "../layouts/DefaultLayout";
import CreateWordSet from "../pages/CreateWordSet";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import FlashCard from "../pages/Learnings/FlashCard";
import HeaderOnly from "../layouts/HeaderOnly";
import {
  Collection,
  CollectionDetail,
  EditWordset,
  LearningPage,
} from "@pages/index";
import WordSetPage from "@pages/WordSetPage/WordSetPage";

const publicRoutes = [
  { path: "/", Page: Home, Layout: DefaultLayout },
  { path: "/login", Page: Login },
  { path: "/register", Page: Register },
  { path: "/verify-email", Page: VerifyEmail },
  { path: "/wordset/:id/:slug", Page: WordSetPage, Layout: DefaultLayout },
  { path: "/flashcard/:id", Page: FlashCard, Layout: HeaderOnly },
  {
    path: "/collection/:id/wordsets",
    Page: CollectionDetail,
    Layout: DefaultLayout,
  },
];

const privateRoutes = [
  { path: "/createwordset", Page: CreateWordSet, Layout: DefaultLayout },
  { path: "/profile", Page: Profile, Layout: DefaultLayout },
  { path: "/setting", Page: Setting, Layout: DefaultLayout },
  { path: "/collection", Page: Collection, Layout: DefaultLayout },
  { path: "/wordset/:id/edit", Page: EditWordset, Layout: DefaultLayout },
  { path: "/learning/:slug", Page: LearningPage, Layout: DefaultLayout },
];

const adminRoutes = [
  {
    path: "/admin",
    Page: Home,
    Layout: DefaultLayout,
    roles: ["ADMIN"],
  },
];

export { publicRoutes, privateRoutes, adminRoutes };
