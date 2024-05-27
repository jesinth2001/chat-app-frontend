import React from 'react'
import { useEffect ,useState,useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/chat.css"
import { backendUrl } from '../config/config';
import axios from 'axios';
import Welcome from './Welcome';
import Chat from './Chat';
import { FaPowerOff } from "react-icons/fa6";
import {io} from "socket.io-client"


const Console = () => {
  const navigate=useNavigate()
  const [contact,setContact]=useState([]);
  const [currentUser,setCurrentUser]=useState(undefined);
  const [currentUserName,setCurrentUserName]=useState(); 
  const [currentUserImage,setCurrentUserImage]=useState();
  const [currentUserChat,setCurrentUserChat]=useState(undefined);
  const chatContainer=useRef(null)
  const socket=useRef()


    useEffect(()=>{
      if(currentUser){
        socket.current=io(backendUrl)
        socket.current.emit("add-user",currentUser._id)
      }

    },[currentUser])

  useEffect(() => {
    const getCurrentUser=async () =>{
    const user= await JSON.parse(localStorage.getItem('user-log'));
 
    setCurrentUser(user);
  }
  getCurrentUser();

  },[])

  useEffect(() => {
  
    const getcontacts =async() =>{
      if (currentUser){
        setCurrentUserName(currentUser.username)
        setCurrentUserImage(currentUser.avatarImage)
        if(currentUser.isAvatarImageSet) {
          const data= await axios.get(`${backendUrl}/getAllUsers/${currentUser._id}`);

          setContact(data.data);
        }
        else{
          navigate("/setprofile")
        }
      }
    }

    getcontacts(); 
  },[currentUser])
  
  const changeCurrentChat =(index,contact)=>{
  setCurrentUserChat(contact)
  chatContainer.current.style.transform ='translateX(0%)' 
  }

  const handleLogout =() =>{
    localStorage.clear();
    navigate("/")
  }

  return (
    <div>
      <section className='chat-console'>
        <div className='chat-container'>
          <div className='user-console'>
             <header className='header'> 
                <div className='current-user'>
                   <img src={`data:image/svg+xml;base64,${currentUserImage}`} />
                   <h3>{currentUserName}</h3>
                </div>
                 <div className='logout'>
                   <FaPowerOff className='logout' onClick={handleLogout}></FaPowerOff>
                </div>
             </header>
               <div className='user-friends'>
                   <h3 className='chats-title' >chats</h3>
                   <div className='contact-container'>
                    {
                      contact.map((contact,index) =>
                      {
                        return (<div className='contact' key={index} 
                                     onClick={()=>{changeCurrentChat(index,contact)}}>
                                <div className='user-contacts'>
                                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} />
                                <h3>{contact.username}</h3>
                                </div>
                        </div>)
                      })
                    }
                   </div>
                </div>
          </div>
          <div className='chats' ref={chatContainer} >
             {currentUserChat===undefined ?<Welcome username={currentUserName}/>:<Chat  chatContainer={chatContainer} currentChat={currentUserChat}
             currentUser={currentUser} socket={socket}/>}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Console