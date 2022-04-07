import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/AuthProvider"

export const useRequireAuth = (redirectTo ="/sign-in") => {
    const [{ accessToken }] = useAuthContext();
    let navigate = useNavigate();
    useEffect(() => {
        if (accessToken == null) navigate(redirectTo);
    }, [accessToken, redirectTo, navigate]);
}

export const useRequireAdmin = (redirectTo = "/sign-in") => {
    const [{accessToken, profile}] = useAuthContext();
    let navigate = useNavigate();
    useEffect(() => {
        if(accessToken == null) navigate(redirectTo);
        else if(profile.admin) navigate(redirectTo);
    }, [accessToken, redirectTo, navigate])
}

export const useRequireLector = (redirectTo = "/sign-in") => {
    const [{accessToken, profile}] = useAuthContext();
    let navigate = useNavigate();
    useEffect(() => {
        if(accessToken == null) navigate(redirectTo);
        else if(profile.lector) navigate(redirectTo);
    }, [accessToken, redirectTo, navigate])
}