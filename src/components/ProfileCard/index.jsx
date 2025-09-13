import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Background, Image, Images } from "../../assets/images";
import styles from "./ProfileCard.module.css";
import classNames from "classnames/bind";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useUser } from "../../context/UserProvider";

const c = classNames.bind(styles);

function ProfileCard({ className }) {
  const { user } = useUser();

  return (
    <div className={c("profileCard", className)}>
      {/* slider */}
      <div className={c("slider")}>
        <Background
          className={c("banner")}
          src="https://wallpapers.com/images/featured/universe-qs811igzbabl1m0o.jpg"
        >
          <div className={c("header", "px-3")}>
            <div className={c("avatar", "me-2")}>
              <Image src={user.avatar || Images.avatar} size="107px" />
            </div>
            <div className={c("name")}>Nhật Bủn</div>
          </div>
        </Background>
      </div>
      {/* content */}
      <div className={c("content", "px-3")}>
        <hr />
        <ul
          className={c(
            "social",
            "d-flex",
            "align-items-center",
            "justify-content-center"
          )}
        >
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
        </ul>
        <hr />
        <ul className={c("information")}>
          <li>
            <div className="">Nơi ở: </div>
            <div className="">Ninh Bình</div>
          </li>
          <li>
            <div className="">Tuổi: </div>
            <div className="">20</div>
          </li>
          <li>
            <div className="">Trường: </div>
            <div className="">ĐH CN Đông Á</div>
          </li>
        </ul>
        <hr />
      </div>
    </div>
  );
}

export default ProfileCard;
