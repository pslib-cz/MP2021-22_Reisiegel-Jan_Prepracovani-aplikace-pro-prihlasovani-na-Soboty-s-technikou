import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

export const SignOutCallback = props => {
    const [{ userManager }] = useAuthContext();
    let navigate = useNavigate();
    if (userManager) userManager.signoutRedirectCallback();
    navigate("/");
    return null;
}

export default SignOutCallback;