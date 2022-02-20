import React, { useState } from "react";

const EditGroup = () => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groupData, setGroupData] = useState();

    const [name, setName] = useState();
    const [desc, setDes] = useState();
    const [capacity, setCapacity] = useState();
    const [open, setOpen] = useState();
    const [headLector, setHeadLectorId] = useState();
    const [action, setAction] = useState();
}

export default EditGroup;