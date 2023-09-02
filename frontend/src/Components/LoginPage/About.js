import React from 'react'

const About = () => {
  return (
    <div className='card fixed-height'>
        <div className='card-header text-center'>
            <h4>About CSBox</h4>
        </div>
        <div className='card-body'>
            <p className='text-center'>CSBox is an all-in-one educational platform offering session creation, file management, and blogging capabilities. It fosters collaboration and knowledge sharing among users, creating an enriched learning environment.</p>
            <div className='row btn-custom-group2 mt-5'>
                <a className='col mt-1 btn-pip' target='_blank' href='https://react.dev/learn'>React</a>
                <a className='col mt-1 btn-pip' target='_blank' href='https://docs.djangoproject.com/en/4.2/'>Django</a>
                <a className='col mt-1 btn-pip' target='_blank' href='https://www.django-rest-framework.org/'>Rest Framework</a>
                <a className='col mt-1 btn-pip' target='_blank' href='https://restfulapi.net/'>Restful APIs</a>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center mt-4'>
                <h5 className='text-center mt-1'>Source Code</h5>
                <a className='btn btn-custom-green' target='_blank' href='https://github.com/tanvirmahmud66/CSBox_React_Django.git'>Github</a>
            </div>
        </div>
    </div>
  )
}

export default About