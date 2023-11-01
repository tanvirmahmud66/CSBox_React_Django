import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import BaseUrl from '../../Components/BaseUrl';

const VerficationPage = () => {
    const{id, username} = useParams()
    console.log("id: ", id , typeof(id))
    console.log("username", username, typeof(username))

    let accountVerification = async ()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/verify-user/${id}/${username}/verified/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        let data = await response.json()
        console.log(data)
    }

    useEffect(()=>{
        accountVerification();
    },[])



  return (
    <div className="notification-container">
        <div class="alert alert-success" role="alert">
            <h4 className="alert-heading">Verified <FontAwesomeIcon icon={faCheckCircle} /></h4>
            <p className='mt-4'>Dear {username}, your account is Verified. Now! please <a className='' href='/login'>login</a> again.</p>
        </div>
  </div>
  )
}

export default VerficationPage