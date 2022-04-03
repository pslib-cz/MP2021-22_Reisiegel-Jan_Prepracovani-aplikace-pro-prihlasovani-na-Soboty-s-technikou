import React, { useEffect, useState } from 'react';
import { SILENT_RENEW_ERROR, useAuthContext } from '../providers/AuthProvider';
import { IconButton, Message } from 'rsuite';
import { Link } from 'react-router-dom';
import { Edit } from '@rsuite/icons/lib/icons';
import axios from 'axios';
import ActionOnHome from './ActionsComponents/ActionOnHome';

export const Home = () => {
  const [{ userManager, accessToken, profile }] = useAuthContext();
  const [isCompleted, setIsCompleted] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(profile)  
    return (
      <div className='text-center'>
        {
          accessToken ?
          !profile.completed_information ?
            <Message type="error" header="Nevyplněné informace" >
              <p>Nemůžete se přihlásit na jakoukoli akci, protože nemáte vyplněné nějaké důležité informace</p>
              <IconButton color='red' as={Link} to={"/EditUser"} icon={<Edit />} appearance='ghost' >Doplnit informace</IconButton>
            </Message>
            : null : null
        }
        <ActionOnHome />
      </div>
    )

}

export default Home;

