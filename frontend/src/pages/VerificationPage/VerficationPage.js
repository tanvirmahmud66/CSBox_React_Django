import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const VerficationPage = () => {
    const{id, username} = useParams()
    console.log("id: ", id , typeof(id))
    console.log("username", username, typeof(username))

    let accountVerification = async ()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/verify-user/${id}/${username}/verified/`, {
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
        <div className="alert bg-custom-light-dark text-center" role="alert">
            <h4 className="alert-heading text-green">Verified</h4>
            <p className='mt-4'>Dear {username}, your account is Verified. Now! please <a className='btn btn-custom2-green' href='/login'>login</a> again.</p>
        </div>
  </div>
  )
}

export default VerficationPage