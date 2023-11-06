import React from 'react'
import react from '../../assets/react_logo.png'
import python from '../../assets/python_logo.png'
import django from '../../assets/django_logo.png'
import rest from '../../assets/rest_logo.png'

const About = () => {
  return (
    <div className='card fixed-height2 shadow'>
        <div className='card-header text-center'>
            <h4>About CSBox</h4>
        </div>
        <div className='card-body'>
            <p className='text-center'>CSBox is an all-in-one educational platform offering session creation, file management, and blogging capabilities. It fosters collaboration and knowledge sharing among users, creating an enriched learning environment.</p>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h5 className='text-center'>Development Tools</h5>
                <div className='d-flex'>
                    <img src={react} alt='react-logo' width={50}/>
                    <img src={python} alt='react-logo' width={50}/>
                    <img src={django} alt='react-logo' width={50}/>
                    <img src={rest} alt='react-logo' width={50}/>
                </div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h5 className='text-center'>Source Code</h5>
                <a className='btn btn-custom-green' target='_blank' href='https://github.com/tanvirmahmud66/CSBox_React_Django.git'>Github</a>
            </div>
        </div>
    </div>
  )
}

export default About