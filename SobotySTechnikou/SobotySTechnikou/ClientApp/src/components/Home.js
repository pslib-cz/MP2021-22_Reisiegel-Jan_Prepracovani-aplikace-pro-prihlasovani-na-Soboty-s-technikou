import React, { useEffect, useState } from 'react';
import { SILENT_RENEW_ERROR, useAuthContext } from '../providers/AuthProvider';
import { IconButton, Message } from 'rsuite';
import { Link } from 'react-router-dom';
import { Edit } from '@rsuite/icons/lib/icons';
import axios from 'axios';
import ActionOnHome from './ActionsComponents/ActionOnHome';

export const Home = () => {
  const [{ userManager, accessToken }] = useAuthContext();
  const [isCompleted, setIsCompleted] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(userManager)

  const getInfo = () => {
    setIsLoading(true);
    setError(false);
    axios.get("/api/Users/IsCompleted", {
      headers: {
        //"Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then(response => {
      //setIsCompleted(response.data);
      console.log(response.data);
      setError(false);
    })
    .catch(error => {
      setError(true);
    })
    .finally(()=>{
      setIsLoading(false);
    })
  }
  useEffect(() => {
    getInfo();
  }, [accessToken])
  if (accessToken) {
    return (
      <div className='text-center'>
        {
          !isCompleted ?
            <Message type="error" header="Nevyplněné informace" >
              <p>Nemůžete se přihlásit na jakoukoli akci, protože nemáte vyplněné nějaké důležité informace</p>
              <IconButton color='red' as={Link} to={"/EditUser"} icon={<Edit />} appearance='ghost' >Doplnit informace</IconButton>
            </Message>
            : null
        }
        <ActionOnHome />
      </div>
    )
  }
  else {
    return (
      <div className='text-center'>

      </div>
    )
  }

}

export default Home;

