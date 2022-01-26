import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider";

export const SilentRenewCallback = props => {
    const [{ userManager }] = useAuthContext();
    let navigate = useNavigate();
    if (userManager) userManager.signinSilentCallback();
    navigate("/");
    return null;
}

export default SilentRenewCallback;