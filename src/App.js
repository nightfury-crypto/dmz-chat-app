import { useContext } from 'react';
import './App.css';
import Auth from './pages/auth/Auth';
import ChatRoom from './pages/chatroom/ChatRoom';
import Mainscreen from './pages/mainscreen/Mainscreen';
import { Routes, Route } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import UserProfile from './pages/userprofile/UserProfile';

function App() {
  const { currentUser } = useContext(AuthContext)

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // on resize
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

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
