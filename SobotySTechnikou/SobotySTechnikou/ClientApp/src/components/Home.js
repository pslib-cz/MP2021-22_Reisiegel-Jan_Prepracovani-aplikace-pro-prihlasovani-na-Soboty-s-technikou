
import { Button } from 'reactstrap';
import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';

export const Home = () => {
    const [{ userManager, accessToken }] = useAuthContext();
    console.log(userManager)
  return (
      <div className='text-center'>
          
    </div>
  )
}

export default Home;

