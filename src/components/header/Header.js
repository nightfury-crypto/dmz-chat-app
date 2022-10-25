import './Header.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseSetup';
import { Avatar, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useContext,  useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Header() {
  const { currentUser } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className='header'>
      <h1 className='logo'>dmz</h1>
      <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName}
        style={{ width: '25px', height: '25px' }} onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined} />

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5,
            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
            '&:before': {
              content: '""', display: 'block', position: 'absolute', top: 0, right: 10, width: 10,
              height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >
        <MenuItem>
        <Link to="/profile" style={{display: 'flex', textDecoration: 'none', justifyContent: 'center', color: 'inherit', alignItems: 'center'}}>
          <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName} /> Profile
        </Link>
        </MenuItem>
        <MenuItem onClick={() => signOut(auth)}>
          <ListItemIcon style={{ color: '#fff' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Header;