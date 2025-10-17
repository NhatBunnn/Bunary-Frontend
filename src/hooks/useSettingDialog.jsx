import { useRef, useState } from "react";
import { useNotification } from "../context/NotificationProvider";
import { useFetcher } from "@api/fetcher";
import { useUser } from "@context/UserProvider/UserContext";

function useSettingDialog(initialValue = "", initialField = "") {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [value, setValue] = useState(initialValue);
  const [field, setField] = useState(initialField);

  const prevValueRef = useRef(initialValue);

  const { showNotification } = useNotification();

  const { fetcher } = useFetcher();
  const { user } = useUser();

  const handleSaveInfo = async () => {
    setErrors("");

    if (!avatarFile && value === prevValueRef.current) {
      setErrors("Vui lòng nhập địa chỉ mới");
      return null;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append([field], value);

      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const response = await fetcher({
        url: `/api/v1/users/${user.id}`,
        method: "PUT",
        data: formData,
      });

      const dataResponse = await response.json();

      if (dataResponse.statusCode >= 200 && dataResponse.statusCode < 300) {
        window.location.reload();
        prevValueRef.current = value;
        showNotification("Đổi địa chỉ thành công", "success");
        console.log(dataResponse.data);
      } else {
        console.log(dataResponse.error);
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSaveInfo,
    value,
    setValue,
    field,
    setField,
    errors,
    loading,
    setAvatarFile,
  };
}

export default useSettingDialog;
