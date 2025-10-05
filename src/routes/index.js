import DefaultLayout from "../layouts/DefaultLayout";
import CreateWordSet from "../pages/CreateWordSet";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import WordSetPage from "../pages/WordSetPage";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import FlashCard from "../pages/Learnings/FlashCard";
import HeaderOnly from "../layouts/HeaderOnly";
import { Collection, CollectionDetail, EditWordset } from "@pages/index";

//Route ko cần đăng nhập cx xem đc
const publicRoutes = [
  { path: "/", Page: Home, Layout: DefaultLayout },
  { path: "/login", Page: Login },
  { path: "/register", Page: Register },
  { path: "/verify-email", Page: VerifyEmail },
  { path: "/createwordset", Page: CreateWordSet, Layout: DefaultLayout },
  { path: "/wordset/:id/:slug", Page: WordSetPage, Layout: DefaultLayout },
  { path: "/profile", Page: Profile, Layout: DefaultLayout },
  { path: "/setting", Page: Setting, Layout: DefaultLayout },
  { path: "/flashcard/:id", Page: FlashCard, Layout: HeaderOnly },
  { path: "/collection", Page: Collection, Layout: DefaultLayout },
  { path: "/wordset/:id/edit", Page: EditWordset, Layout: DefaultLayout },

  {
    path: "/collection/:id/wordsets",
    Page: CollectionDetail,
    Layout: DefaultLayout,
  },

  //   { path: "/Upload", Component: Upload, layout: HeaderOnly },
];

//Route cần đăng nhập mới xem đc
const privateRoutes = [];

export { publicRoutes, privateRoutes };
