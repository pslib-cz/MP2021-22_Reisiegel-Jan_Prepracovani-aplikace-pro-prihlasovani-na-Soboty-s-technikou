import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../providers/AuthProvider";

const Users = props => {
    const [{accessToken}] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState();

    const getUsers = () => {
        setIsLoading(true);
        setError(false);
        axios.get("/api/Users/AllUsers", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setUsers(response.data);
            setError(false);
            console.log(response);
        })
        .catch(error=>{
            setError(true);
        })
        .finally(()=>{
            setIsLoading(false);
        });
    }
    useEffect(()=>{
        getUsers();
    }, [accessToken])
    return(
        <div>

        </div>
    )
}
export default Users;