import { useState } from "react";
import { useNotification } from "../context/NotificationProvider";

//
function useStatus() {
  const { showNotification } = useNotification();

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  return {
    success,
    setSuccess,
    errors,
    setErrors,
    loading,
    setLoading,
    showNotification,
  };
}

export default useStatus;
