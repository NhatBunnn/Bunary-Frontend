import { useUser } from "@context/UserProvider/UserProvider";
import Loading from "../../components/Loading/Loading";
import TitleSection from "../../components/TitleSection";
import SettingItem from "./component/SettingItem";
import SettingPanel from "./component/SettingPanel";
import styles from "./Setting.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function Setting() {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={c("setting")}>
      <TitleSection title="Cài đặt tài khoản" onTop={true} />
      <SettingPanel title="Thông tin cá nhân">
        <SettingItem isAvatar={true} label="Ảnh đại diện" type="avatar" />
        <SettingItem
          label="Họ và tên"
          value={`${user?.lastName || ""} ${user?.firstName || ""}`.trim() || "Chưa cập nhật"}
        />
        <SettingItem label="Biệt danh" value={user?.username || user?.nickname || "N/A"} />
        <SettingItem label="Ngày sinh" value={user?.dateOfBirth || "N/A"} field="dateOfBirth" />
        <SettingItem
          label="Giới tính"
          value={user?.gender || "N/A"}
          field="gender"
        />
        <SettingItem
          label="Địa chỉ"
          value={user?.address || "N/A"}
          field="address"
        />
      </SettingPanel>
      <SettingPanel title="Bảo mật">
        <SettingItem label="Email" value={user?.email || "N/A"} />
        <SettingItem label="Mật khẩu" value="***************" />
      </SettingPanel>
      <SettingPanel title="Tài khoản">
        <SettingItem label="Xóa tài khoản" value={user?.email || "Yêu cầu xóa tài khoản"} />
      </SettingPanel>
    </div>
  );
}

export default Setting;
