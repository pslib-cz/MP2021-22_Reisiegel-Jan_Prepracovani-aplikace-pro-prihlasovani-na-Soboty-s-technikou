import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

export const SignInCallback = props => {
    const [{ userManager }] = useAuthContext();
    let navigate = useNavigate();
    if (userManager) userManager.signinRedirectCallback();
    navigate("/");
    return null;
}

export default SignInCallback;