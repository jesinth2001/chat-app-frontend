import React, { useEffect, useState, useRef } from 'react'
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { SiGrammarly } from "react-icons/si";
import Picker from 'emoji-picker-react';
import loader from "../Assets/Rolling-1s-200px.svg"
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import { backendUrl } from '../config/config';




const Chat = ({ currentChat, chatContainer, currentUser, socket }) => {

  const [emoji, setEmoji] = useState(false);
  const [msg, setMsg] = useState("");
  const [userMessage, setUserMessage] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef=useRef()


  useEffect(() => {
 
    const getAllMessages = async () => {
      const response = await axios.post(`${backendUrl}/getAllMessages`, {
        from: currentUser._id,
        to: currentChat._id
      })
      console.log(response.data);
      setUserMessage(response.data)
    }
    if(currentChat)
    {
    setMsg("")
    getAllMessages()
    }

  }, [currentChat])

  const pickEmoji = () => {
    setEmoji(!emoji);
  }
  const handleEmojiClick = (emoji) => {
    setMsg((prevMsg) => prevMsg + emoji.emoji);
  }
  const modelPredict = async () => {

    setIsLoading(false);

    try {
      const data = await axios.post(' http://127.0.0.1:5000/predict', msg, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      setMsg(data.data)
      setIsLoading(true);
    }
    catch (err) {
      console.log(err)
    }
  }
  const closeChat = () => {
    chatContainer.current.style.transform = 'translateX(100%)'

  }
  const sendMessage = async () => {
    try {
      const data = await axios.post(`${backendUrl}/sendMessage`, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
      const msgs=[...userMessage];
      msgs.push({fromSelf:true, message:msg})
      setUserMessage(msgs)
      setMsg("")
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() =>{
    if(socket.current){
      socket.current.on("msg-received",(msg) =>{
        setArrivalMessage({fromSelf:false,message:msg})
      })
    }
  },[])

  useEffect(() =>{
    arrivalMessage && setUserMessage((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage])

  useEffect(() =>{
    scrollRef.current?.scrollIntoView()
  },[userMessage])



  return (
    <div className='currentchat-container' >
      <header className='chat-header'>
        <FaArrowLeft className='backward-btn' onClick={closeChat}></FaArrowLeft>
        <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} />
        <h3>{currentChat.username}</h3>
      </header>
      <div className='chat-body'>
        {
          userMessage && userMessage.map((index) => {
            return (<div ref={scrollRef}>
              <div className={`message ${index.fromSelf ? "sended" : "recieved"}`}>
                <div className='content'>
                  <p>{index.message}</p>
        
                </div>
                <p className='timestamps'>{new Date(index.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            )
          })
        }

      </div>

      <div className='chat-footer'>
        <div className='emoji-cont'>
          {emoji && <Picker onEmojiClick={handleEmojiClick} />}</div>
        {isLoading ? <SiGrammarly onClick={modelPredict} className='emoji'></SiGrammarly> : <img className='emoji'
          style={{ height: "2rem" }} src={loader} alt='loader' />}
        <BsEmojiSmileFill onClick={pickEmoji} className='emoji' ></BsEmojiSmileFill>
        <div className='user-keyboard'>
          <input type='text' className="send-btn" placeholder='Message' value={msg} onChange={(e) => { setMsg(e.target.value) }}></input>
          <span onClick={sendMessage}><IoMdSend /></span>
        </div>

      </div>
    </div>
  )
}

export default Chat