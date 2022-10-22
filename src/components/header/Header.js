import './Header.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/FirebaseSetup';
import { Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";

function Header() {
  const { currentUser } = useContext(AuthContext)

  const [userData, setUserData] = useState({})

  useEffect(() => {
    const unsub = async () => {
      const uid = currentUser.uid
      const usersDocRef = doc(db, "users", uid);
      const checkexists = await getDoc(usersDocRef);
      if (checkexists.exists()) {
        setUserData(checkexists.data())
      } else {
        setUserData(currentUser)
      }
    }
    return () => {
      unsub()
    }
  }, [currentUser])


  return (
    <div className='header'>
      <h1 className='logo'>dmz</h1>
      <Avatar src={userData.profilePhoto} alt={userData.displayName}
        style={{ width: '25px', height: '25px' }} />
      <MoreVertIcon onClick={() => signOut(auth)} />
    </div>
  )
}

export default Header;