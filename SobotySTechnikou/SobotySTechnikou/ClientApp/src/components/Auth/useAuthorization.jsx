import { useEffect } from "react";
import { useAuthContext } from "../../providers/AuthProvider";

export const useRequireAuth = () => {
    const [{ accessToken }] = useAuthContext();
    useEffect(()=>{
        if (accessToken == null) return false;
    else return true;
    }, [accessToken])

}

export const useRequireAdmin = () => {
    const [{ accessToken, profile }] = useAuthContext();
    useEffect(() => {
        if (accessToken == null) return false;
        else if (profile.admin) return false;
        else return true;
    }, [accessToken])
}

export const useRequireLector = () => {
    const [{ accessToken, profile }] = useAuthContext();
    useEffect(() => {
        if (accessToken == null) return false;
        else if (profile.lector) return false;
        else return true;
    }, [accessToken])
}

export const getAuthorization = ({admin, lector, accessToken, profile}) => {
    if(admin){
        if (accessToken == null) return false;
        else if (profile.admin) return false;
        else return true;
    }
    else if(lector){
        if (accessToken == null) return false;
        else if (profile.lector) return false;
        else return true;
    }
    else {
        if (accessToken == null) return false;
    }
}