import { useState } from "react";

function useAuthBase() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
    fieldErrors,
    setFieldErrors,
    loading,
    setLoading,
  };
}

export default useAuthBase;
