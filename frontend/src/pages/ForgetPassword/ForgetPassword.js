import React, { useEffect, useState } from 'react'
import BaseUrl from '../../Components/BaseUrl'

const ForgetPassword = () => {

    const [eamilSection, setEmailSection] = useState(true)
    const [verifySection, setVerifySection] = useState(false)
    const [resetSection, setResetSection] = useState(false)
    const [validEmail, setValidEmail] = useState()
    const [token, setToken] = useState()
    const [invalid, setInvalid] = useState(false)

    const [notfound, setNotfound] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [checkMail, setCheckMail] = useState(false)
    const [notMatched, setNotMatched] = useState(false)

    let sendcode = async(e)=>{
        e.preventDefault()
        setSpinner(true)
        let response = await fetch(`${BaseUrl.baseUrl}/api/forget-password/check-email/`, {
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
            setValidEmail(data.email)
            setToken(data.code)
        }
    }

    let verifyCode = async(e)=>{
        console.log(token)
        console.log(validEmail)
        e.preventDefault()
        let response = await fetch(`${BaseUrl.baseUrl}/api/forget-password/check-code/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'code':e.target.code.value, 'token': token})
        })
        if (response.status===200){
            setEmailSection(false)
            setVerifySection(false)
            setCheckMail(false)
            setResetSection(true)
            setInvalid(false)
        }else if(response.status===400){
            setInvalid(true)
        }
    }

    let resetPassword = async(e)=>{
        e.preventDefault()
        let response = await fetch(`${BaseUrl.baseUrl}/api/forget-password/reset-password/`,{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'email':validEmail,
                'password': e.target.password.value,
                'password2':e.target.password2.value
            })
        })
        if(response.status===205){
            setNotMatched(false)
            alert("Password Reset Successfully")
        }else if(response.status===400){
            setNotMatched(true)
        }
    }

    useEffect(()=>{
        setTimeout(()=>{
            setNotfound(false)
        },15000)
    },[notfound])

  return (
        <div className='vh-90 d-flex justify-content-center align-items-center'>
            <div className={`card my-card ${resetSection? "w-100":""} shadow`}>
                <div className='card-header text-primary fs-4'>Forget Password</div>

                    {eamilSection &&
                        <div className='card-body'>
                            <div className='mb-3'>Enter your email address, and we'll send a verification code to your inbox. Paste the code, create a new password, and you're back in control of your account.</div>
                            
                            <form onSubmit={sendcode} className=''>
                                <div className="form-group">
                                    <input type="email" name='email' className="form-control mb-3" id="email" placeholder="Email" required/>
                                    {spinner ?
                                        <button className="btn btn-primary ms-1" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="visually-hidden">Loading...</span>
                                        </button>:
                                        <button className='btn btn-primary'>Send Code</button>
                                    }
                                </div>
                            </form>
                        </div>
                    }

                    {verifySection &&
                        <div className='card-body'>
                            <div className='mb-3'>Now, submit the code that we send you to your email</div>
                            <form className='' onSubmit={verifyCode}>
                                <div className="form-group d-flex justify-content-between align-items-center">
                                    <input type="text" name='code' className="form-control w-80" id="code" placeholder="Submit Code" required/>
                                    <button className='btn btn-primary ms-1 w-30'>Submit</button>
                                </div>
                            </form>
                        </div>
                    }

                    {resetSection &&
                        <div className='card-body'>
                            <div className='mb-3'>Reset your password</div>
                            <form onSubmit={resetPassword} className=''>
                                <div className="form-group ">
                                    <input type="password" name='password' className="form-control" id="password" placeholder="New password" required/>
                                    {notMatched && <div className='text-danger'>password not matched</div>}
                                </div>
                                <div className="form-group mt-2">
                                    <input type="password" name='password2' className="form-control" id="password2" placeholder="Confirm new password" required/>
                                    {notMatched && <div className='text-danger'>password not matched</div>}
                                </div>
                                <button className='btn btn-custom-green mt-3 w-100'>Reset Password</button>
                            </form>
                        </div>
                    }
                    
                    {notfound && 
                        <div className='card-footer pb-0'>
                            <div className="alert alert-danger text-center mt-2" role="alert">
                                Can't find your account, please enter valid email !!
                            </div>
                        </div>
                    }
                    {checkMail && 
                        <div className='card-footer pb-0'>
                            <div className="alert alert-success text-center mt-2" role="alert">
                                We send an unique code to your email address, please check your email.
                            </div>
                        </div>
                    }

                    {invalid && 
                        <div className='card-footer pb-0'>
                            <div className="alert alert-warning text-center mt-2" role="alert">
                                Invalid Code!! Please check your email and submit valid code.
                            </div>
                        </div>
                    }
                    

            </div>
        </div>
  )
}

export default ForgetPassword;