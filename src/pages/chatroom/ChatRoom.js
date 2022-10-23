import "./ChatRoom.css"
import { useRef, useEffect, useState, useContext } from "react"

// material ui
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar, IconButton, Slider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/FirebaseSetup";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";


const ChatRoom = () => {
    const [inpmsg, setInpmsg] = useState('')
    const scrollRef = useRef(null)
    const history = useNavigate();
    const [messages, setMessages] = useState([])
    const { roomId } = useParams();
    
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", roomId), (doc) => {
            setMessages(doc.data().messages)
        })
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView()
        }

        return () => {
            unsub()
        }

    }, [roomId])

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

    function valuetext(value) {
        return `${value}°C`;
    }

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
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            {/* mid */}
            <div className="chatroom__mid">

                {messages.map((chat, i) => (
                    <div key={i} className={`${chat.uid === currentUser.uid ? "send" : "receive"}`}>
                        <div className="main">
                            <div className="chatavatar">
                                <Avatar alt={chat.avatarAlt}
                                    src={chat.avatarSrc} />
                            </div>
                            <div className="chatmsg">
                                {/* chat message */}
                                <div className="captionimg">
                                    {chat.msgImg && <img src={chat.msgImg} alt={chat.avatarAlt} />}
                                    {chat.chatmessage && <p>{chat.chatmessage}</p>}
                                    {chat.chataudio && <div className="chataudio">
                                        <span>
                                            <PlayArrowIcon />
                                        </span>
                                        <Slider
                                            aria-label="Temperature"
                                            defaultValue={30}
                                            getAriaValueText={valuetext}
                                            color="secondary"
                                        />
                                    </div>}
                                </div>

                                {/* time */}
                                <div className="msgtime">
                                    <p>{chat.messageTime}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
                <div className="justforref" ref={scrollRef}></div>
            </div>

            {/* foot */}
            <div className="chatroom__foot">
                <span>
                    <textarea placeholder="Send a message" value={inpmsg} id="inpmsg"
                        onChange={(e) => { setInpmsg(e.target.value); }} />
                    <IconButton>
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

export default ChatRoom
