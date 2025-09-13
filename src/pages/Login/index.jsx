import AuthForm from "../../components/AuthForm";
import AuthWrapper from "../../components/wrapper/AuthWrapper";

function Login() {
  return (
    <AuthWrapper>
      <AuthForm type="login" />
    </AuthWrapper>
  );
}

export default Login;
