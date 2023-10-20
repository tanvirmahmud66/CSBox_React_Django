import React from 'react'
import LoginForm from '../../Components/LoginPage/LoginForm'
import About from '../../Components/LoginPage/About'
import KeyFeatures from '../../Components/LoginPage/KeyFeatures'
import DeveloperTeam from '../../Components/LoginPage/DeveloperTeam'

const LoginPage = () => {
  return (
    <div className='row'>
        <div className='col-mg-12 col-lg-6 col-xl-6 col-xxl-6 mt-4'>
            <LoginForm/>
        </div>
        <div className='col-md-12 col-md-6 col-lg-6 col-xxl-6 mt-4'>
            <About/>
        </div>
        <div className='col-md-12 col-md-6 col-lg-6 col-xxl-6 mt-4'>
            <KeyFeatures/>
        </div>
        <div className='col-md-12 col-lg-6 col-xl-6 col-xxl-6 mt-4 mb-4'>
            <DeveloperTeam/>
        </div>
    </div>
  )
}

export default LoginPage;