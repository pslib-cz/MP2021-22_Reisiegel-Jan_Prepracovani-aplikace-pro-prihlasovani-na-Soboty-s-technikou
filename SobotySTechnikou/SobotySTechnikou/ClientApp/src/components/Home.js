
import { Button } from 'reactstrap';
import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';

export const Home = () => {
    const [{ userManager, accessToken }] = useAuthContext();
    console.log(userManager)
  return (
      <div className='text-center'>
          {userManager ? 
        accessToken ?
          <Button color="danger" onClick={() => { userManager.signoutRedirect() }} >Odhlásit</Button>
          : <Button color="success" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }} >Přihlásit</Button>
        : null
      }
    </div>
  )
}

export default Home;

