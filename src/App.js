import { useContext, useEffect } from 'react';
import './App.css';
import Auth from './pages/auth/Auth';
import ChatRoom from './pages/chatroom/ChatRoom';
import Mainscreen from './pages/mainscreen/Mainscreen';
import { Routes, Route } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import UserProfile from './pages/userprofile/UserProfile';
import { push, ref, serverTimestamp, set, onDisconnect, onValue } from 'firebase/database';
import { realDatabase } from './firebase/FirebaseSetup';

function App() {
  const { currentUser } = useContext(AuthContext)

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // on resize
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  useEffect(() => {
    const statusDetect = () => {
      const unsub = () =>{
        const uid = currentUser.uid;
    const userStatusDatabaseRef = ref(realDatabase, 'status/' + uid);
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: serverTimestamp(),
    };
    const connectedRef = ref(realDatabase, '.info/connected');
    onValue(connectedRef, (snap) => {
      // If we're not currently connected, don't do anything.
      if (snap.val() === false) {
        return;
      };
      const con = push(userStatusDatabaseRef);
      // When I disconnect, remove this device
      onDisconnect(con).remove();
      set(con, true);
      onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
        console.log('disconnected')
        set(userStatusDatabaseRef, isOnlineForDatabase);
      })
    });

      }

      return () => {
        unsub()
      }
    }

    currentUser?.uid && statusDetect()
        
  }, [currentUser?.uid])
  return (
    <div className="App">
      {!currentUser ? <Auth /> :
        <Routes>
          <Route index path='/' element={<Mainscreen />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/chatroom/:roomId' element={<ChatRoom />} />
        </Routes>
      }
    </div>
  );
}

export default App;
