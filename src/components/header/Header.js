import './Header.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseSetup';
import { Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Header() {
  const { currentUser } = useContext(AuthContext)

  return (
    <div className='header'>
      <h1 className='logo'>dmz</h1>
      <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName}
        style={{ width: '25px', height: '25px' }} />
      <MoreVertIcon onClick={() => signOut(auth)} />
    </div>
  )
}

export default Header;