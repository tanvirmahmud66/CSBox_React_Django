import React, { useEffect, useState } from 'react'

const ForgetPassword = () => {

    const [eamilSection, setEmailSection] = useState(true)
    const [verifySection, setVerifySection] = useState(false)
    const [resetSection, setResetSection] = useState(false)
    const [email, setEmail] = useState()

    const [notfound, setNotfound] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [checkMail, setCheckMail] = useState(false)

    let sendcode = async(e)=>{
        e.preventDefault()
        setSpinner(true)
        let response = await fetch('http://127.0.0.1:8000/api/forget-password/check-email/', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'email':e.target.email.value})
        })
        let data = await response.json()
        console.log(data)
        if (response.status===404){
            setNotfound(true);
            setSpinner(false)
        }else if(response.status===302){
            setSpinner(false)
            setVerifySection(true)
            setCheckMail(true)
            setEmailSection(false)
        }
    }

    useEffect(()=>{
        setTimeout(()=>{
            setNotfound(false)
        },15000)
    },[notfound])

  return (
    <>
        <div className='d-flex justify-content-center align-items-center vh-70 position-relative'>
            <div className='card w-60 mt-5'>
                <div className='card-header text-primary'>Forget Password?</div>

                    {eamilSection &&
                        <div className='card-body'>
                            <div className='mb-3'>Enter your email address, and we'll send a verification code to your inbox. Paste the code, create a new password, and you're back in control of your account.</div>
                            
                            <form onSubmit={sendcode} className=''>
                                <div className="form-group d-flex justify-content-between align-items-center">
                                    <input type="email" name='email' className="form-control w-80" id="email" placeholder="Email" required/>
                                    {spinner ?
                                        <button className="btn btn-primary ms-1 w-30" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="visually-hidden">Loading...</span>
                                        </button>:
                                        <button className='btn btn-primary ms-1 w-30'>Send Code</button>
                                    }
                                </div>
                            </form>
                        </div>
                    }

                    {verifySection &&
                        <div className='card-body'>
                            <div className='mb-3'>Now, submit the code that we send you to your email: {email}</div>
                            <form className=''>
                                <div className="form-group d-flex justify-content-between align-items-center">
                                    <input type="text" name='code' className="form-control w-80" id="code" placeholder="Submit Code" required/>
                                    <button className='btn btn-primary ms-1 w-30'>Submit</button>
                                </div>
                            </form>
                        </div>
                    }

            </div>
            {notfound && 
                <div className="alert alert-danger w-60 text-center position-absolute bottom-0 mb-5" role="alert">
                    Can't find your account, please enter valid email !!
                </div>
            }
            {checkMail && 
                <div className="alert alert-success w-60 text-center position-absolute bottom-0 mb-5" role="alert">
                    We send an unique code to your email address, please check your email.
                </div>
            }
        </div>
    </>
  )
}

export default ForgetPassword;