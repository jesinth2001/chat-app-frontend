import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../Assets/welcomechat.json'


const Welcome = ({username}) => {
  return (
    <div className='welcome'>
        <div className='chat-anime'>
        <Lottie animationData={animationData}/>
        </div>
        <div className='welcome-greets'>
          Welcome,<span>{username}</span>
         <h4>Start a new conversation</h4>
        </div>
        
        </div>
  )
}

export default Welcome