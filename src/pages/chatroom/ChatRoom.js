import "./ChatRoom.css"
import { useEffect, useState, useContext } from "react";

// material ui
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import CancelIcon from '@mui/icons-material/Cancel';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton  } from "@mui/material";
import {  useParams } from "react-router-dom";
import { onSnapshot, doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { db, realDatabase, storage } from "../../firebase/FirebaseSetup";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Messages from "../../components/messages/Messages";
import { StatusContext } from "../../context/StatusContext";
import { onValue, ref as dbref } from "firebase/database";
import ChatRoomTop from "../../components/chatroomtop/ChatRoomTop";


const ChatRoom = () => {
    const [inpmsg, setInpmsg] = useState('')
    const [activeStatus, setActiveStatus] = useState('')
    const [imgmsg, setImgmsg] = useState(null)
    const [imgpreview, setImgpreview] = useState(null)
    const { roomId } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(ChatContext);
    const { statusData, dispatchStatus } = useContext(StatusContext);

    // user connected get data
    useEffect(() => {
        const getUsersChat = () => {
            const unsub = onSnapshot(doc(db, "users-chat", currentUser.uid), (doc) => {
                dispatchStatus({ type: "CHANGE_STATUS", payload: doc.data()[roomId].userInfo })
                dispatch({ type: "CHANGE_USER", payload: doc.data()[roomId].userInfo });
            });
            return () => {
                unsub()
            }
        }
        currentUser.uid && getUsersChat();
    }, [currentUser.uid, roomId, dispatch, dispatchStatus])

    useEffect(() => {
        const fetchStatus = () => {
            const statusRef = dbref(realDatabase, 'status/' + statusData.userID);
            onValue(statusRef, (snapshot) => {
                const data = snapshot.val();
                setActiveStatus(data)
            });
            return () => {
                statusRef()
            }
        }

        statusData.userID && fetchStatus()
    }, [statusData.userID])

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
                    console.log(error)
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", roomId), {
                            messages: arrayUnion({
                                id: uuid(),
                                imgmsg: downloadURL,
                                filetype: imgmsg.type,
                                textmsg: inpmsg,
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
    }

    // function valuetext(value) {
    //     return `${value}°C`;
    // }
    return (
        <div className="chatroom">
            <div className="chatroom__top">
                <ChatRoomTop activeStatus={activeStatus} data={data} setImgmsg={setImgmsg} />
            </div>

            {/* mid */}
            <div className="chatroom__mid">
                {/* messages components */}
                <Messages roomId={roomId} />
                <div className="justforref" style={{ height: '20px' }}>&nbsp;</div>
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
