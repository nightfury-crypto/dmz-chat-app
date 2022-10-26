import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Person4Icon from '@mui/icons-material/Person4';
import FaceIcon from '@mui/icons-material/Face';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import './UserProfile.css'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseSetup';

function UserProfile() {
  const history = useNavigate();
  const [usersData, setUsersData] = useState(null)
  const { currentUser } = useContext(AuthContext)

    // user connected get data
    useEffect(() => {
      const getUsersChat = () => {
        const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          doc.data() && setUsersData(doc.data())
        });
  
        return () => {
          unsub()
        }
      }
      currentUser.uid && getUsersChat();
    }, [currentUser.uid])

  return (
    <div className='userprofile'>
      <div className="userprofile__top">
        <IconButton onClick={() => history(-1)}>
          <ArrowBackIcon style={{ color: '#fff' }} />
        </IconButton>
      </div>
      <div className="userprofile__content">
        <div className="userprofile__pic">
          <div className="pic"><img src={usersData?.photoURL} alt={currentUser?.displayName} /></div>
          <label htmlFor="uploadpic">change profile pic<span></span></label>
          <input type="file" name="uploadpic" id="uploadpic" />
        </div>
        <div className="userprofile__bottom">
          <div><span><Person4Icon /> </span><div className="details"><span>Name</span> <p>{usersData?.displayName}</p></div></div>
          <div><span><FaceIcon /> </span><div className="details"><span>Username</span> <p>{usersData?.username}</p></div></div>
          <div><span><MarkEmailReadIcon /> </span><div className="details"><span>Email</span> <p>{usersData?.email}</p></div></div>
          <div><span><ErrorOutlineOutlinedIcon /> </span><div className="details"><span>About</span> <p>Nothing better than dmz</p></div></div>
        </div>
      </div>



    </div>
  )
}

export default UserProfile