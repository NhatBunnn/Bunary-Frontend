import { useRef, useState } from "react";
import { getAccessToken, getCurrentUserId } from "../service/apiService";
import { useNotification } from "../context/NotificationProvider";
import { API_URL } from "../config/apiConfig";

function useSettingDialog(initialValue = "", initialField = "") {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [value, setValue] = useState(initialValue);
  const [field, setField] = useState(initialField);

  const prevValueRef = useRef(initialValue);

  const { showNotification } = useNotification();

  const handleSaveInfo = async () => {
    setErrors("");

    if (!avatarFile && value === prevValueRef.current) {
      setErrors("Vui lòng nhập địa chỉ mới");
      return null;
    }

    setLoading(true);

    try {
      const token = await getAccessToken();

      const formData = new FormData();
      formData.append([field], value);

      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const response = await fetch(
        `${API_URL}/api/v1/users/${getCurrentUserId()}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        }
      );

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
