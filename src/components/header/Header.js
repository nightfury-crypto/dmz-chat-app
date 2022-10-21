import React, { useEffect, useState } from 'react';
import './Header.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header() {
  const [showArrow, setShowArrow] = useState(false)

  useEffect(() => {
    setShowArrow(false)
  }, [])

  return (
    <div className='header'>
      {showArrow && <ArrowBackIcon />}
      <h1 className='logo'>dmz</h1>
      <AccountCircleIcon />
      <MoreVertIcon />
    </div>
  )
}

export default Header;