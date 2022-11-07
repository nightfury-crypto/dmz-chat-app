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
      if (currentUser?.uid) {
        const uid = currentUser.uid;
        const myConnectionsRef = ref(realDatabase, 'status/'+uid);
        // stores the timestamp of my last disconnect (the last time I was seen online)
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
          if (snap.val() === true) {
            console.log("connected")
            set(myConnectionsRef, isOnlineForDatabase)
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            const con = push(myConnectionsRef);

            // When I disconnect, remove this device
            onDisconnect(con).remove();

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            set(con, true);

            // When I disconnect, update the last time I was seen online
            onDisconnect(myConnectionsRef).set(isOfflineForDatabase);
          } else {
            console.log("disconnected")
          }
        });

      }

  }, [currentUser?.uid])
  return (
    <div className="App">
      {!currentUser ? <Auth /> :
      <>
        <Routes>
          <Route index path='/' element={<Mainscreen />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/chatroom/:roomId' element={<ChatRoom />} />
        </Routes>
      </>
      }
    </div>
  );
}

export default App;
