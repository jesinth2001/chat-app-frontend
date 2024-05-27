import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { backendUrl } from '../config/config'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate=useNavigate()
  const [values,setValues] =useState({
    email:"",
    password:"",
  })

  const toasOptions ={
    position:"top-right",
    autoClose:5000,
    pauseOnHover:true,
    draggable:true,
    
  }

  useEffect(() => {
    if(localStorage.getItem('user-log')){
      navigate('/chat')
    }
  },[])

  const generateError=(error)=>{
    toast.error(error,toasOptions.position)
  }

  const handleSubmit = async () => {
    if(handleValidation())
    {
      const {data} =await axios.post(`${backendUrl}/login`,{...values});
      console.log(data);
      if(data.errors){
        const {email,password}=data.errors;
        if(email)generateError(email)
        if(password)generateError(password)
      }
      else{
        localStorage.setItem('user-log',JSON.stringify(data.user))
        navigate("/chat")
      }

    }
  }
  const handleValidation = () =>{
    const {password,email}=values;
     if( password==="")
     {
      toast.error("Enter Password",toasOptions)
      return false;
     }
     else if(email==="")
     {
      toast.error("Enter Email address",toasOptions)
      return false;
     }
  return true;
  }

  return (
    <div className='register'>
      <ToastContainer></ToastContainer>
      <section className='register-cont'>
        <div className='container'>
            <h1> Welcome Back</h1>
            <input
             type='email'
             placeholder='Email'
             name='email'
             onChange={(e)=>setValues({...values,[e.target.name]:e.target.value})}
            />
              <input
             type='password'
             placeholder='Password'
             name='password'
             onChange={(e)=>setValues({...values,[e.target.name]:e.target.value})}
            />
              <input
             type='Submit'
             value='LOGIN'
             onClick={handleSubmit}
               />

            <span>DON'T HAVE AN ACCOUNT ? <Link className='link' to={"/register"}>CREATE</Link></span>

        </div>

      </section>
    </div>
  )
}

export default Login