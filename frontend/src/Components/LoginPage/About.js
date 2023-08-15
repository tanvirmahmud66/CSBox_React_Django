import React from 'react'

const About = () => {
  return (
    <div className='card bg-custom-light-dark'>
        <div className='card-header text-center'>
            <h4>About CSBox</h4>
        </div>
        <div className='card-body'>
            <p className='text-center'>CSBox is an all-in-one educational platform offering session creation, file management, and blogging capabilities. It fosters collaboration and knowledge sharing among users, creating an enriched learning environment.</p>
            <div className='row btn-custom-group2 mt-5'>
                <button className='col mt-1 btn-pip'>React</button>
                <button className='col mt-1 btn-pip'>Django</button>
                <button className='col mt-1 btn-pip'>Rest Framework</button>
                <button className='col mt-1 btn-pip'>Restful APIs</button>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center mt-4'>
                <h5 className='text-center mt-1'>Source Code</h5>
                <a className='btn btn-custom-green'>Github</a>
            </div>
        </div>
    </div>
  )
}

export default About