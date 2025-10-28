import styles from "./Homepage.module.css";
import classNames from "classnames/bind";
import Loading from "@components/Loading";
import { useUser } from "@context/UserProvider/UserContext";
import { useParams } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyWordSets from "./pages/MyWordSets/MyWordSets";
import Tabs from "./components/Tabs/Tabs";
import { useEffect, useState } from "react";
import PopularWordSet from "./pages/PopularWordSet/PopularWordSet";

const c = classNames.bind(styles);

function Homepage() {
  const { slug } = useParams();

  const [active, setActive] = useState("route");

  const tabComponents = {
    home: <Home />,
    MyWordSets: <MyWordSets />,
    popular_wordsets: <PopularWordSet />,
  };

  useEffect(() => {
    if (slug && tabComponents[slug]) {
      setActive(slug);
    } else {
      setActive("home");
    }
  }, [slug]);

  return (
    <div className={c("Homepage", "w-100")}>
      <Tabs active={active} />

      {tabComponents[active] || <Home />}
    </div>
  );
}

export default Homepage;
