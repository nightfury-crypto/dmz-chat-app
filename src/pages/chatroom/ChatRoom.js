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
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebase/FirebaseSetup";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";


const ChatRoom = () => {
    const [inpmsg, setInpmsg] = useState('')
    // const [imgmsg, setImgmsg] = useState(null)
    const scrollRef = useRef(null)
    const history = useNavigate();
    const [messages, setMessages] = useState([])
    const [oppUser, setOppUser] = useState(null)
    const [curUser, setCurUser] = useState(null)
    const { roomId } = useParams();

    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(ChatContext);

    useEffect(() => {
        if (roomId || scrollRef.current) {
            scrollRef.current.scrollIntoView()
        }
    }, [messages])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", roomId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })
        return () => {
            unsub()
        }
    }, [roomId])

    // user connected get data
    useEffect(() => {
        const getUsersChat = () => {
            const unsub = onSnapshot(doc(db, "users-chat", currentUser.uid), (doc) => {
                dispatch({ type: "CHANGE_USER", payload: Object.entries(doc.data())[0][1].userInfo });
            });
            return () => {
                unsub()
            }
        }
        currentUser.uid && getUsersChat();
    }, [currentUser.uid])


    const handlesubmitmsg = async (e) => {
        if (inpmsg.trim()) {
            await updateDoc(doc(db, "chats", roomId), {
                messages: arrayUnion({
                    id: uuid(),
                    textmsg: inpmsg,
                    messageTime: Timestamp.now(),
                    uid: currentUser.uid,
                }),
            });
            setInpmsg('')
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
        }
    }

    // demo data
    const chatsAll = [
        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chatmessage: "Hi.", messageType: "chat", messageTime: '6:00am'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", chatmessage: "Oye hello.", messageType: "chat", messageTime: '6:52am'
        },


        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", chatmessage: "kya kr rhi?", messageType: "chat", messageTime: '6:52am'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chatmessage: "Kuch bhi nhi leti hu bed pe subha se kaam kr rhi thi. Thak gyi. Ab toh bs neend aa rhi.",
            messageType: "chat", messageTime: '7:15am'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chatmessage: "aap kkrh?", messageType: "chat", messageTime: '7:20am'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chatmessage: "mummy bula rhi hai aati hu thodi der mai.", messageType: "chat", messageTime: "7:21am"
        },

        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", chatmessage: "ok ok aram krle fir jab free hogi msg kr dena.", messageType: "chat", messageTime: "7:50am"
        },

        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", chatmessage: "mai toh football khelne jaunga thodi der mai half hour mai. Aake baat krta hu.", messageType: "chat", messageTime: '4:03pm'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chatmessage: "Apni dp bhejna yaha pe", messageType: "chat", messageTime: '8:03pm'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", chatmessage: "wait...", messageType: "chat", messageTime: '9:12pm'
        },
        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", chataudio: 'j', messageTime: '9:20pm'
        },
        {
            avatarSrc: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "me", chatType: "send", msgImg: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600",
            messageType: "image", messageTime: '9:22pm'
        },

        {
            avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            avatarAlt: "Pia", chatType: "receive", msgImg: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
            chatmessage: "This is my dp. ^^", messageType: "image", messageTime: '9:45pm'
        },
    ]

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
                {messages.map(msg => (
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
                                    {/* {msg.msgImg && <img src={chat.msgImg} alt={chat.avatarAlt} />} */}
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
                                <div className="msgtime">
                                    <p>10:00am</p>
                                </div>
                            </div >
                        </div >
                    </div >
                ))}

                <div className="justforref" ref={scrollRef}></div>
            </div>

            {/* foot */}
            <div className="chatroom__foot">
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

export default ChatRoom


