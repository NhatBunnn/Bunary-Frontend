import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { adminRoutes, privateRoutes, publicRoutes } from "./routes";
import { Fragment } from "react/jsx-runtime";
import GlobalProfiders from "./context/GlobalProviders";

import Notification from "./components/Notification";
import "./i18n";
import CreateCollection from "@features/collection/components/CreateCollection/CreateCollection";
import AddToCollection from "@pages/WordSetPage/dialogs/AddToCollection/AddToCollection";

import PrivateRoute from "@routes/PrivateRoute.jsx";
import RoleRoute from "@routes/RoleRoute";
import { ChatWindow } from "./components";

function App() {
  return (
    <Router>
      <div className="App">
        <GlobalProfiders>
          <ChatWindow />

          <CreateCollection />
          <AddToCollection />
          <Notification />
          <Routes>
            {/* Public routes */}
            {publicRoutes.map((route, index) => {
              const Page = route.Page;
              let Layout = Fragment;

              if (route.Layout) {
                Layout = route.Layout;
              } else {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
            {/* Private routes */}
            {privateRoutes.map((route, index) => {
              const Page = route.Page;
              let Layout = Fragment;

              if (route.Layout) {
                Layout = route.Layout;
              } else {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              );
            })}
            {/* admin routes */}
            {adminRoutes.map((route, index) => {
              const Page = route.Page;
              let Layout = Fragment;

              if (route.Layout) {
                Layout = route.Layout;
              } else {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <RoleRoute allowedRoles={route.roles}>
                      <Layout>
                        <Page />
                      </Layout>
                    </RoleRoute>
                  }
                />
              );
            })}
          </Routes>
        </GlobalProfiders>
      </div>
    </Router>
  );
}

export default App;
