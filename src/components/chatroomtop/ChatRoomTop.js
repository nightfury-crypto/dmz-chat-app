import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ChatRoomTop = ({ activeStatus, data, setImgmsg }) => {
    const history = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
console.log(activeStatus)
    // menu open close handle
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <>
            <IconButton onClick={() => history(-1)}>
                <ArrowBackIcon />
            </IconButton>

            <span>
                <div className="chatavatar">
                    <Avatar src={data.user.profilePhoto}
                        alt={data.user.username} />
                </div>
                <span>
                    <h3>{data.user.username}</h3>
                    <p><span className="dot"
                        style={{ backgroundColor: activeStatus?.state === "online" ? 'seagreen' : 'crimson' }}></span>
                        <span>{activeStatus?.state}</span></p>
                </span>
            </span>

            <div className="options">
                <input type="file" name="" id="msgimgid" style={{ display: 'none' }}
                    onChange={(e) => setImgmsg(e.target.files[0])} />

                <IconButton id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>

                <Menu id="basic-menu" anchorEl={anchorEl} open={open}
                    onClose={() => setAnchorEl(null)} MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}>
                    <MenuItem onClick={() => setAnchorEl(null)}>
                        <label htmlFor="msgimgid">Send image</label>
                    </MenuItem>
                </Menu>

            </div>
        </>
    )
}

export default ChatRoomTop
