import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BaseUrl from '../../Components/BaseUrl';

const RegistrattionPage = () => {

  const formRef = useRef();
  let [notificaiton, setNotification] = useState(false)
  const [usernameErr, setUsernameErr] = useState()
  const [emailErr, setEmailErr] = useState()
  const [passwordErr, setPasswordErr] = useState()
  const [spinner, setSpinner] = useState(false) 

  let registration = async(e)=>{
    e.preventDefault()
    setSpinner(true)
    setUsernameErr('')
    setEmailErr('')
    setPasswordErr('')
    console.log("registration function working")
    let response = await fetch(`${BaseUrl.baseUrl}/api/user-reg/`,{
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        'username':e.target.username.value,
        'first_name':e.target.first_name.value,
        'last_name': e.target.last_name.value,
        'email':e.target.email.value,
        'password': e.target.password.value,
        'password2': e.target.password2.value
      })
    })

    let data = await response.json()
    console.log("Data: ",data)
    // console.log("Response: ",response)
    if (response.status===201){
      setNotification(true)
      setSpinner(false)
      formRef.current.reset();
    }
    if(data.username){
      setUsernameErr(data.username)
      setSpinner(false)
    }
    if(data.email){
      setEmailErr(data.email)
      setSpinner(false)
    }
    if(data.non_field_errors){
      setPasswordErr(data.non_field_errors)
      setSpinner(false)
    }
  }


  return (
    <div className='container vh-90 d-flex justify-content-center align-items-center'>
        <div className="card custom-card p-2">
          <div className='card-header p-0 text-center'>
            <h4>Registration Form</h4>
          </div>
          <div className="card-body">
            <form onSubmit={registration} ref={formRef}>
              <div className="form-group mb-1">
                <label htmlFor="username">Username</label>
                <input type="text" name='username' className="form-control" id="username" required/>
                {usernameErr && <div className='text-danger'>{usernameErr}</div>}
              </div>
              <div className="form-group mb-1">
                <label htmlFor="first_name">First Name</label>
                <input type="text" name='first_name' className="form-control" id="first_name" required/>
              </div>
              <div className="form-group mb-1">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name='last_name' className="form-control" id="last_name" required/>
              </div>
              <div className="form-group mb-1">
                <label htmlFor="email">Email address</label>
                <input type="email" name='email' className="form-control" id="email" required/>
                {emailErr && <div className='text-danger'>{emailErr}</div>}
              </div>
              <div className="form-group mb-1">
                <label htmlFor="password">Password</label>
                <input type="password" name='password' className="form-control" id="password" required/>
                {passwordErr && <div className='text-danger'>{passwordErr}</div>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password2">Confirm Password</label>
                <input type="password" name='password2' className="form-control" id="password2" required/>
                {passwordErr && <div className='text-danger'>{passwordErr}</div>}
              </div>
              <div className='d-flex flex-column justify-content-between align-items-center'>
                <button type="submit" className="btn btn-custom-green d-flex alight-items-center">
                  <div className='text-white me-2 mt-1'>Confirm Register</div>
                  {spinner && 
                    <div className="spinner-border text-light" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  }
                  
                </button>
                <Link className='text-decoration-none mt-2' to='/login'>Already have an Account?</Link>
              </div>
            </form>
          </div>
        </div>

        {notificaiton && 
          <div className="toast-container position-fixed bottom-0 start-0 p-3">
          <div className="toast show bg-custom-light-dark" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
              <small>Just now</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
              Please go to your email address and confirm your registration process.
            </div>
          </div>
        </div>
        }
        
    </div>
  )
}

export default RegistrattionPage