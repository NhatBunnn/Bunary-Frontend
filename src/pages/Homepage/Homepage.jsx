import styles from "./Homepage.module.css";
import classNames from "classnames/bind";
import Loading from "@components/Loading";
import { useUser } from "@context/UserProvider/UserContext";
import { useParams } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyWordSets from "./pages/MyWordSets/MyWordSets";
import Tabs from "./components/Tabs/Tabs";
import { useEffect, useState } from "react";

const c = classNames.bind(styles);

function Homepage() {
  const { user, loadingUser } = useUser();
  const { slug } = useParams();

  const [active, setActive] = useState("route");

  const tabComponents = {
    home: <Home />,
    MyWordSets: <MyWordSets />,
  };

  useEffect(() => {
    if (slug && tabComponents[slug]) {
      setActive(slug);
    } else {
      setActive("home");
    }
  }, [slug]);

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <div className={c("Homepage", "w-100")}>
      {user && <h3>Hello bạn: {user.fullName}</h3>}
      <Tabs active={active} />

      {tabComponents[active] || <Home />}
    </div>
  );
}

export default Homepage;
