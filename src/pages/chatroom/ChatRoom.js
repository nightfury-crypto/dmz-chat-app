import "./ChatRoom.css"
import { useRef, useEffect, useState, useContext } from "react";

// material ui
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/FirebaseSetup";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const ChatRoom = () => {
    const [inpmsg, setInpmsg] = useState('')
    const [imgmsg, setImgmsg] = useState(null)
    const [imgpreview, setImgpreview] = useState(null)
    const scrollRef = useRef(null)
    const history = useNavigate();
    const [messages, setMessages] = useState([])
    const { roomId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(ChatContext);

    // scroll to latest msg
    useEffect(() => {
        if (messages && scrollRef.current) {
            scrollRef.current.scrollIntoView()
        }
    }, [messages])

    //  all chats and setMessages
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", roomId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        })
        return () => {
            unsub()
        }
    }, [roomId])

    // user connected get data
    useEffect(() => {
        const getUsersChat = () => {
            const unsub = onSnapshot(doc(db, "users-chat", currentUser.uid), (doc) => {
                dispatch({ type: "CHANGE_USER", payload: doc.data()[roomId].userInfo });
            });
            return () => {
                unsub()
            }
        }
        currentUser.uid && getUsersChat();
    }, [currentUser.uid, roomId, dispatch])

    // Handle selected images
    useEffect(() => {
        if (imgmsg) {
            setImgpreview(URL.createObjectURL(imgmsg))
        }
    }, [imgmsg])

    // send message
    const handlesubmitmsg = async () => {
        if (imgmsg) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, imgmsg);
            uploadTask.on(
                (error) => {
                    console.log("error")
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", roomId), {
                            messages: arrayUnion({
                                id: uuid(),
                                imgmsg: downloadURL,
                                textmsg: inpmsg && inpmsg,
                                messageTime: Timestamp.now(),
                                uid: currentUser.uid,
                            }),
                        });
                    });
                }
            );
            setInpmsg("")
            setImgmsg(null)
            setImgpreview(null)

        } else if (inpmsg.trim()) {
            await updateDoc(doc(db, "chats", roomId), {
                messages: arrayUnion({
                    id: uuid(),
                    textmsg: inpmsg && inpmsg,
                    messageTime: Timestamp.now(),
                    uid: currentUser.uid,
                }),
            });
            setInpmsg("")
            setImgmsg(null)
            setImgpreview(null)
        }
        await updateDoc(doc(db, "users-chat", currentUser.uid), {
            [roomId + ".userInfo.lastmessage"]: imgmsg ? "sent a photo" : inpmsg,
            [roomId + ".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, "users-chat", data.user.uid), {
            [roomId + ".userInfo.lastmessage"]: imgmsg ? "sent a photo" : inpmsg,
            [roomId + ".date"]: serverTimestamp()
        })
        setInpmsg("")
        setImgmsg(null)
        setImgpreview(null)
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }

    // convert firebase timestamp
    const converttime = (s) => {
        const t = new Date(s * 1000)

        if (((new Date().getTime()) - (new Date(s * 1000).getTime())) < 10000) {
            return "Just Now"
        }
        // format time
        const h = t.getHours() > 9 ? t.getHours() : `0${t.getHours()}`
        const m = t.getMinutes() > 9 ? t.getMinutes() : `0${t.getMinutes()}`
        return h + ":" + m
    }

    // function valuetext(value) {
    //     return `${value}°C`;
    // }

    // menu open close handle
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div className="chatroom">
            <div className="chatroom__top">
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
                        <p><span className="dot"></span><span>online</span></p>
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
            </div>

            {/* mid */}
            <div className="chatroom__mid">
                {messages?.map(msg => (
                    <div key={msg.id} className={`${msg.uid === currentUser.uid ? "sendMsg" : "receiveMsg"}`}>
                        <div className="main">
                            <div className="chatavatar">
                                <Avatar src={msg.uid === currentUser.uid ?
                                    currentUser.photoURL : data.user.profilePhoto}
                                    alt={msg.uid === currentUser.uid ?
                                        currentUser.displayName : data.user.username} />
                            </div>
                            <div className="chatmsg">
                                {/* chat message */}
                                <div className="captionimg">
                                    {msg.imgmsg && <img src={msg.imgmsg} alt={msg.uid} />}
                                    {msg.textmsg && <p>{msg.textmsg}</p>}
                                    {/* {chat.chataudio && <div className="chataudio">
                                        <span>
                                            <PlayArrowIcon />
                                        </span>
                                        <Slider
                                            aria-label="Temperature"
                                            defaultValue={30}
                                            getAriaValueText={valuetext}
                                            color="secondary"
                                        />
                                    </div>} */}
                                </div>

                                {/* time */}
                                <div className="msgtime" >
                                    <p>{converttime(msg.messageTime.seconds)}</p>
                                </div>
                            </div >
                        </div >
                    </div >
                ))}
                <div className="justforref" ref={scrollRef}>&nbsp;</div>
            </div>

            {/* foot */}
            <div className="chatroom__foot">
                {imgpreview && <div className="imgpreview">
                    <img src={imgpreview} alt="preview" />
                    <CancelIcon onClick={() => {
                        setImgpreview(null)
                        setImgmsg(null)
                    }} />
                </div>}
                <span>
                    <textarea placeholder="Send a message" value={inpmsg} id="inpmsg"
                        onChange={(e) => { setInpmsg(e.target.value); }} />
                    <IconButton onClick={(e) => handlesubmitmsg(e)}>
                        <SendIcon />
                    </IconButton>
                </span>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default ChatRoom;


    // demo data
    // const chatsAll = [
    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chatmessage: "Hi.", messageType: "chat", messageTime: '6:00am'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", chatmessage: "Oye hello.", messageType: "chat", messageTime: '6:52am'
    //     },


    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", chatmessage: "kya kr rhi?", messageType: "chat", messageTime: '6:52am'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chatmessage: "Kuch bhi nhi leti hu bed pe subha se kaam kr rhi thi. Thak gyi. Ab toh bs neend aa rhi.",
    //         messageType: "chat", messageTime: '7:15am'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chatmessage: "aap kkrh?", messageType: "chat", messageTime: '7:20am'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chatmessage: "mummy bula rhi hai aati hu thodi der mai.", messageType: "chat", messageTime: "7:21am"
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", chatmessage: "ok ok aram krle fir jab free hogi msg kr dena.", messageType: "chat", messageTime: "7:50am"
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", chatmessage: "mai toh football khelne jaunga thodi der mai half hour mai. Aake baat krta hu.", messageType: "chat", messageTime: '4:03pm'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chatmessage: "Apni dp bhejna yaha pe", messageType: "chat", messageTime: '8:03pm'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", chatmessage: "wait...", messageType: "chat", messageTime: '9:12pm'
    //     },
    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", chataudio: 'j', messageTime: '9:20pm'
    //     },
    //     {
    //         avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "me", chatType: "send", msgImg: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         messageType: "image", messageTime: '9:22pm'
    //     },

    //     {
    //         avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         avatarAlt: "Pia", chatType: "receive", msgImg: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    //         chatmessage: "This is my dp. ^^", messageType: "image", messageTime: '9:45pm'
    //     },
    // ]
