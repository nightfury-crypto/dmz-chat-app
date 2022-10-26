import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { db } from '../../firebase/FirebaseSetup';
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Avatar } from '@mui/material';

const Messages = ({ roomId }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([])
    const scrollRef = useRef(null)
    // scroll to latest msg
    useEffect(() => {
        const scrollDown = () => {
            const unsub = scrollRef.current.scrollIntoView()
            return () => {
                unsub()
            }
        }

        (messages && scrollRef.current) && scrollDown()
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
    return (
        <>
            {messages?.map(msg => (
                <div key={msg.id} ref={scrollRef} className={`${msg.uid === currentUser.uid ? "sendMsg" : "receiveMsg"}`}>
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
                                {msg.imgmsg && <>
                                    {msg.filetype && msg.filetype.split('/')[0] === 'image' ?
                                        <img src={msg.imgmsg} alt="dmz" /> : <video controls autoPlay src={msg.imgmsg} alt="dmz" />}</>}
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
        </>
    )
}

export default Messages
