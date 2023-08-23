import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/fontawesome-free';


const DeveloperTeam = () => {
  return (
    <div className='card fixed-height2 bg-custom-light-dark'>
        <div className='card-header text-center'>
            <h4>Developer Team</h4>
        </div>
        <div className='card-body text-center'>
            <div className='fs-4'>Tanvir Mahmud</div>
            <div className='mt-1'>Software Engineer</div>
            <div className='mt-1 text-primary d-flex justify-content-between align-items-center'>
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                <div className='ms-1'>tanvirmahmud.cse66@gmail.com</div>
            </div>
            <div className="social-icons mt-5 container">
                <a href="https://github.com/tanvirmahmud66" target='_blank' className="social-icon"><i className="fab fa-github fa-3x" style={{color: 'white'}}></i></a>
                <a href="https://www.linkedin.com/in/tanvirmahmud61" target='_blank' className="social-icon"><i className="fab fa-linkedin fa-3x"></i></a>
                <a href="https://www.facebook.com/tanvir.mahmud.520357" target='_blank' className="social-icon"><i className="fab fa-facebook fa-3x"></i></a>
            </div>
        </div>
        
    </div>
  )
}

export default DeveloperTeam