import React, { useContext, useEffect, useState } from 'react'
import './Mainscreen.css'
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/header/Header';
import { Link } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/FirebaseSetup.js";
import { ChatContext } from '../../context/ChatContext';

function Mainscreen() {
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)
  const [userschatData, setUserschatData] = useState([])

  // search related
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedUser, setSearchedUser] = useState('')
  const [noUserFound, setNoUserFound] = useState(false)

  // user connected get data
  useEffect(() => {
    const getUsersChat = () => {
      const unsub = onSnapshot(doc(db, "users-chat", currentUser.uid), (doc) => {
        doc.data() && setUserschatData(Object.entries(doc.data()))
      });

      return () => {
        unsub()
      }
    }
    currentUser.uid && getUsersChat();
  }, [currentUser.uid])

  // search for user to add
  const handlesearch = async (e) => {
    e.preventDefault();

    const q = query(collection(db, "users"), where("email", "==", searchQuery))
    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        if (doc.data().email !== currentUser.email) {
          setSearchedUser(doc.data())
          setNoUserFound(false);
          setSearchQuery('')
        } else {
          console.log('no user')
          setNoUserFound(true)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  // add user to chatbars
  const handleadduser = async () => {
    const combindId = currentUser.uid > searchedUser.uid ?
      currentUser.uid + searchedUser.uid :
      searchedUser.uid + currentUser.uid

    try {
      const res = await getDoc(doc(db, "chats", combindId));
      if (!res.exists()) {
        // created chats doc
        await setDoc(doc(db, "chats", combindId), { messages: [] })

        // // current user data
        await updateDoc(doc(db, "users-chat", currentUser.uid), {
          [combindId + ".userInfo"]: {
            uid: searchedUser.uid,
            username: searchedUser.username,
            profilePhoto: searchedUser.profilePhoto,
            lastmessage: 'Say Hi!'
          },
          [combindId + ".date"]: serverTimestamp()
        })


        // getCurrent user details from database
        const curGet = await getDoc(doc(db, "users", currentUser.uid))
        // friend
        await updateDoc(doc(db, "users-chat", searchedUser.uid), {
          [combindId + ".userInfo"]: {
            uid: curGet.data().uid,
            username: curGet.data().username,
            profilePhoto: curGet.data().profilePhoto,
            lastmessage: 'Say Hi!'
          },
          [combindId + ".date"]: serverTimestamp()
        })

      }
    } catch (e) {
      console.log(e)
    }
    setSearchedUser('')
  }

  // dispatch
  const handledispatch = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u })
  }

  return (
    <div className='mainscreen'>
      <Header />
      <div className="main__search">
        <form className="search__div" onSubmit={handlesearch}>
          <input type="search" placeholder='Search here' value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
          <SearchIcon onClick={handlesearch} />
        </form>
        {noUserFound && <div className="searchresult" style={{ width: '100%', maxWidth: '310px' }}>
          <div className="chat__card" style={{ maxWidth: '250px' }}>
            <span className="name" style={{ paddingLeft: '10px' }}>No User Found!</span>
            <CancelIcon onClick={() => { setNoUserFound(false); setSearchQuery(''); setSearchedUser(null) }} />
          </div>
        </div>}
        {searchedUser && <div className="searchresult" style={{ width: '100%', maxWidth: '310px' }}>
          <div className="chat__card" style={{ maxWidth: '250px' }}>
            <Avatar src={searchedUser.profilePhoto} alt={searchedUser.displayName} />
            <span className="name" style={{ paddingLeft: '10px' }}>{searchedUser.displayName}</span>
            <IconButton style={{ marginLeft: 'auto', color: '#fff' }} onClick={handleadduser}>
              <AddIcon />
            </IconButton>
            <CancelIcon onClick={() => { setNoUserFound(false); setSearchQuery(''); setSearchedUser(null) }} />
          </div>
        </div>}
      </div>

      <div className="all__chats">
        {(userschatData.length > 0) ? userschatData?.sort((a, b) => b[1].date - a[1].date).map((chat) =>
          <Link to={`/chatroom/${chat[0]}`} key={chat[0]}>
            <div className="chat__card" onClick={() => handledispatch(chat[1].userInfo)}>
              <div className="profile">
                <Avatar src={chat[1].userInfo.profilePhoto} alt={chat[1].userInfo.username} /></div>
              <div className="info">
                <span className="name">{chat[1].userInfo.username}</span>
                <p className="seen">{chat[1].userInfo.lastmessage}</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="no-chat">
            <h3 className="h3">WELCOME</h3>
            <img src="/images/test.png" alt="no chat" />
          </div>
        )}

      </div>
    </div>
  )
}

export default Mainscreen;

// const allchatsUsers = [
//   { name: 'pia', status: '1m ago', bgColor: '#FF5959', profileImg: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600' },
//   { name: 'John Wick', status: 'online', bgColor: '#D5E32C', profileImg: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=600' },
//   { name: 'bae <3', status: 'new message', bgColor: '#0CC7BC', profileImg: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=600' },
//   { name: 'deemak', status: 'theek hai yrr..', bgColor: '#40A41D', profileImg: 'https://images.pexels.com/photos/1819483/pexels-photo-1819483.jpeg?auto=compress&cs=tinysrgb&w=600' },
//   { name: 'no alcohol gang', status: 'karnail left', bgColor: '#838383', profileImg: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=600' },
// ]