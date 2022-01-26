
import { Button } from 'bootstrap';
import React, { Component } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

export const Home = () => {
  const [{ userManager, accessToken }] = useAuthContext();
  return (
    <div className='text-center'>
      {userManager ?
        accessToken ?
          <Button color="danger" onClick={() => { userManager.signoutRedirect() }} >Odhlásit</Button>
          : <Button color="success" onClick={() => { userManager.signinRedirect({ redirectUrl: "/public" }) }} >Přihlásit</Button>
        : null
      }
    </div>
  )
}

export default Home;