import { useState } from "react";
import { useNotification } from "../context/NotificationProvider";

//
function useStatus() {
  const { showNotification } = useNotification();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  return {
    success,
    setSuccess,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
    loading,
    setLoading,
    showNotification,
  };
}

export default useStatus;
