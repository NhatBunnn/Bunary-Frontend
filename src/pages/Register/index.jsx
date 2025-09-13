import AuthForm from "../../components/AuthForm";
import AuthWrapper from "../../components/wrapper/AuthWrapper";

function Register() {
  return (
    <AuthWrapper>
      <AuthForm type="register" />
    </AuthWrapper>
  );
}

export default Register;
