import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react/jsx-runtime";
import GlobalProfiders from "./context/GlobalProviders";

import Notification from "./components/Notification";
import "./i18n";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
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
                  <GlobalProfiders>
                    <Notification />
                    <Layout>
                      <Page />
                    </Layout>
                  </GlobalProfiders>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
