import React from 'react'
import "../css/setprofile.css"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import loader from "../Assets/Infinity-1s-200px.svg"
import { backendUrl } from '../config/config';
import { useNavigate } from 'react-router-dom';


const SetProfile = () => {

    const avatarApi = "https://api.multiavatar.com/45678945"
    const [avatar, setAvatar] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [userName,setUserName]=useState();
    const navigate=useNavigate();

    console.log(typeof(avatar))
    useEffect(() => {
        const getAvatar = async () => {

            const avatarData = await axios.get(`${avatarApi}/${Math.round(Math.random() * 1000)}`)
            const buffer = new Buffer.from(avatarData.data);
            setAvatar(buffer.toString('base64'))
            setIsLoading(false)
        }
        const getUserName =async () =>{
            const user= await JSON.parse(localStorage.getItem('user-log'))
            setUserName(user.username)
        }

        getAvatar();
        getUserName();
    }, [])

    const SetProfile = async(profile) =>{
     
        const user= await JSON.parse(localStorage.getItem('user-log'));
        const {data}=await axios.post(`${backendUrl}/setAvatar/${user._id}`,{
            avatarImage:profile
        
        })
        if(data.isSet)
        {
            user.isAvatarImageSet=true;
            user.avatarImage=data.avatarImage;
            localStorage.setItem('user-log',JSON.stringify(user));
            navigate("/chat")
        }

    }
    
    return (

        <div>
            {
                isLoading ?
                    <div className='loader'>
                        <img className='loader-img' src={loader} alt='loader'/>
                    </div> :
                    <section className='profile'>
                        <div className='profile-cont'>
                            <h3 className='greet'>Welcome back {userName}</h3>
                            <p>Customize your profile with a unique avatar or effortlessly use our charming default-upload your own image with a simple click!</p>
                            <div className='user-profile'>
                                <img src={`data:image/svg+xml;base64,${avatar}`} />
                                <input
                                    type='submit'
                                    value='Continue'
                                   className='continue-btn'
                                   onClick={()=>{SetProfile(avatar)}}
                                 />
                            </div>
                            
                        </div>
                    </section>
            }

        </div>
    )
}

export default SetProfile