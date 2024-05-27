import React from 'react'
import "../css/register.css"
import { useState ,useEffect} from 'react'
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { Link } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../config/config'
import { useNavigate } from 'react-router-dom'


const Register = () => {

  const navigate=useNavigate()
  const [values,setValues] =useState({
    username:"",
    email:"",
    password:"",
    confirmpassword:"",
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
      const {data} =await axios.post(`${backendUrl}/register`,{...values});
      if(data.errors){
        const {password,confirmpassword,username,email}=data.errors;
        if(email)generateError(email)
        if(username)generateError(username)
      }
      else{
        localStorage.setItem('user-log',JSON.stringify(data.user))
        navigate("/")
      }

    }
  }

  const handleValidation = () =>{
    const {password,confirmpassword,username,email}=values;
     if( password!==confirmpassword)
     {
      toast.error("Password and Confirm Password should be the same",toasOptions)
      return false;
     }
     else if( username.length<4)
     {
      toast.error("Username should be greater than 4 characters",toasOptions)
      return false;
     }

     else if( password.length<8)
     {
      toast.error("Password should be equal or greater than 8 characters",toasOptions)
      return false;
     }
     else if(email==="")
     {
      toast.error("email is required",toasOptions)
      return false;
     }

     return true;

  }

  return (
    <div className='register'>
      <ToastContainer></ToastContainer>
      <section className='register-cont'>
        <div className='container'>
       
            <h1> create your account</h1>
            <input
             type='text'
             placeholder='UserName'
             name='username'
             onChange={(e)=>setValues({...values,[e.target.name]:e.target.value})}
            />
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
             type='password'
             placeholder='Confirm Password'
             name='confirmpassword'
             onChange={(e)=>setValues({...values,[e.target.name]:e.target.value})}
            />
              <input
             type='Submit'
             value='CREATE'
             onClick={handleSubmit}
            />

            <span>ALREADY HAVE AN ACCOUNT ? <Link className='link' to={"/"}>LOGIN</Link></span>

        </div>

      </section>

    </div>
  )
}

export default Register