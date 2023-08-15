import React from 'react'
import LoginForm from '../../Components/LoginPage/LoginForm'
import About from '../../Components/LoginPage/About'
import Documentation from '../../Components/LoginPage/Documentation'
import KeyFeatures from '../../Components/LoginPage/KeyFeatures'
import DeveloperTeam from '../../Components/LoginPage/DeveloperTeam'

const LoginPage = () => {
  return (
    <div className='row'>
        <div className='col-mg-12 col-lg-6 col-xl-6 col-xxl-5 mt-4'>
            <LoginForm/>
        </div>
        <div className='col-md-12 col-md-6 col-lg-6 col-xxl-7 mt-4'>
            <About/>
        </div>
        <div className='col-md-12 col-lg-6 mt-4'>
            <KeyFeatures/>
        </div>
        <div className='col'>
            <div className='row'>
                <div className='col-md-12 col-lg-12 col-xl-6 col-xxl-6 mt-4'>
                    <Documentation/>
                </div>
                <div className='col-md-12 col-lg-12 col-xl-6 col-xxl-6 mt-4'>
                    <DeveloperTeam/>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default LoginPage