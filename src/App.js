import { useContext } from 'react';
import './App.css';
import Auth from './pages/auth/Auth';
import ChatRoom from './pages/chatroom/ChatRoom';
import Mainscreen from './pages/mainscreen/Mainscreen';
import { Routes, Route } from "react-router-dom";
import { AuthContext } from './context/AuthContext';

function App() {
  const {currentUser} = useContext(AuthContext)

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // on resize
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <div className="App">
      {!currentUser ? <Routes>
        <Route exact path='/' element={<Auth />} />
      </Routes> :
      <Routes>
        <Route exact path='/' element={<Mainscreen />} />
        <Route path='/chatroom/:roomId' element={<ChatRoom />} />
      </Routes>}
    </div>
  );
}

export default App;
