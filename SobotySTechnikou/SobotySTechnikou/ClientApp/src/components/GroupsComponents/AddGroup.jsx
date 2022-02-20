import React from "react";
import axios from "axios";

const AddGroup = () => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groupData, setGroupData] = useState();

    const [name, setName] = useState();
    const [desc, setDes] = useState();
    const [capacity, setCapacity] = useState();
    const [open, setOpen] = useState();
    const [headLector, setHeadLectorId] = useState();
    const [action, setAction] = useState();

    const [answer, setAnswer] = useState();
 
    const createGroup = () => {
        setIsLoading(true);
        setError(false);
        axios.post("/api/Groups/", {
            name: name,
            description: desc,
            capacity: capacity,
            open: open,
            headLectorId: headLector,
            actionId: action,
        })
        .then(response => {
            setAnswer(response.data);
        })
        .catch(error =>{
            setError(true);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }
    return (
        <div>
            <h2>Vytvořit novou skupinu</h2>
        </div>
    )
}

export default AddGroup;