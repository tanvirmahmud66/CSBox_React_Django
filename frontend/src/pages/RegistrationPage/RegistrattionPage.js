import React, { useRef, useState } from 'react'

const RegistrattionPage = () => {

  const formRef = useRef();
  let [notificaiton, setNotification] = useState(false)

  let registration = async(e)=>{
    e.preventDefault()
    console.log("registration function working")
    let response = await fetch('http://127.0.0.1:8000/api/user-reg/',{
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
    console.log(data)
    if (response.status===201){
      setNotification(true)
      formRef.current.reset();
    }
  }


  return (
    <div className='container vh-85 d-flex justify-content-center align-items-center'>
        <div className="card custom-card bg-custom-light-dark">
          <div className='card-header text-center'>
            <h4>Registration Form</h4>
          </div>
          <div className="card-body">
            <form onSubmit={registration} ref={formRef}>
              <div className="form-group mb-2">
                <label htmlFor="username">Username</label>
                <input type="text" name='username' className="form-control bg-dark text-white" id="username" placeholder="Enter username"/>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="first_name">First Name</label>
                <input type="text" name='first_name' className="form-control bg-dark text-white" id="first_name"/>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name='last_name' className="form-control bg-dark text-white" id="last_name"/>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="email">Email address</label>
                <input type="email" name='email' className="form-control bg-dark text-white" id="email"/>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="password">Password</label>
                <input type="password" name='password' className="form-control bg-dark text-white" id="password"/>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password2">Confirm Password</label>
                <input type="password" name='password2' className="form-control bg-dark text-white" id="password2"/>
              </div>
              <div className='d-flex flex-column justify-content-between align-items-center'>
                <button type="submit" className="btn btn-custom-green">Confirm Register</button>
                <a className='text-decoration-none text-white mt-2' href='/login'>Already have an Account?</a>
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