import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import TimeAgoComponent from '../TimeAgoComponent';
import ProfileContext from '../../context/ProfileContext';
import defaultPic from '../../assets/defaultPic.jpeg';

const Session = (props) => {
    const baseUrl = 'http://127.0.0.1:8000';
    const {title, details, created} = props.session;
    const {id,first_name, last_name} = props.session.host;
    const {profile_pic} = props.session.hostProfile;
    const {user} = useContext(AuthContext)


  return (
    
    <div className='col-6 g-3 mt-3'>
        <Link to={`/session/${props.session.id}`} className='text-decoration-none'>
        <div className={`card fixed-height-card ${user.user_id===id? 'bg-custom-violet': 'bg-custom-blue'} `}>
            <div className='card-body d-flex flex-column justify-content-between '>
                <div className="card-text d-flex">
                    <div className="avatar2">
                        <img src={baseUrl+profile_pic} alt="Profile Picture"/>
                    </div>
                    <div>
                        <h5 className='text-title'>{first_name} {last_name}</h5>
                        <h6 className='text-p'>{details} </h6>
                        <h6 className='text-p'>
                            <TimeAgoComponent dateString={created}/>
                        </h6>
                    </div>
                </div>
                <h5 className="card-title">{title}</h5>
            </div>
        </div>
        </Link>
    </div>
    
  )
}

export default Session