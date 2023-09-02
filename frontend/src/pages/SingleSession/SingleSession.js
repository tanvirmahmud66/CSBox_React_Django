import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostComponent from '../../Components/SingleSession/PostComponent'
import AuthContext from '../../context/AuthContext'
import SinglePost from '../../Components/SingleSession/SinglePost'
import FileDownloadComponent from '../../Components/SingleSession/FileDownload'
import Dropdown from 'react-bootstrap/Dropdown';

const SingleSession = () => {

    const baseUrl = 'http://127.0.0.1:8000';

    const {id} = useParams()

    const {authTokens} = useContext(AuthContext)

    const [isOpen, setIsOpen] = useState(false);

    const [session, setSession] = useState()
    const [posts, setPosts] = useState([])
    const [files, setFiles] = useState([])
    const [member, setMember] = useState([])

    let targetSession = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/single-session/${id}/`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
        })
        let data = await response.json()
        if (response.status === 200){
            // console.log(data)
            setSession(data.session)
            setPosts(data.posts)
            setFiles(data.files)
            setMember(data.members)
        }
    }
 

    useEffect(()=>{
        targetSession()
    },[])

    useEffect(()=>{
        let interval = setInterval(() => {
            targetSession()
        },4000);
        return ()=> clearInterval(interval)
    },[])


    const openModal = () => {
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };

    console.log(member)

  return (
    <>  
        <div className='row timeline-height mt-3'>
            <div className='col-3'>
                <div className='card'>
                    {session &&
                    <>
                        <div className='card-header'>
                            <h3>{session.title}</h3>
                        </div>
                        <div className='card-body'>
                            <h6>Details: {session.details}</h6>
                            <h6>Host: {session.host.first_name} {session.host.last_name}</h6>
                            <h6 className='mt-3'>Token: <span className='ms-2 token text-white'>{session.token}</span></h6>
                        </div>
                    </>}
                </div>
                <div className='mt-4 member-height'>
                    <h5>Session Members</h5>
                    <ul className="list-group member-container">
                        {member.map((each,index)=>(
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className=''>
                                        <img className='avatar' src={baseUrl+each.member.profile.profile_pic}/>
                                        <a href={`/profile/${each.member.id}`} className='text-decoration-none'>{each.member.first_name} {each.member.last_name}</a>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="" id="dropdown-basic"></Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>Remove</Dropdown.Item>
                                            <Dropdown.Item>Block</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                            </li>
                        ))}
                    </ul>
                </div>
                
            </div>
            <div className='col-6 timeline-container'>
                <button className='btn btn-custom-green w-100' onClick={openModal}>Create New Post</button>

                {posts.map((each, index)=>{
                    return(
                        <SinglePost key={index} post={each} sessionUpdate={targetSession} session={session} files={files}/>
                    )
                })}
            </div>
            <div className='col-3 list-group'>
                <div className='list-group-item btn-custom2-green'>Timeline</div>
                <div className='list-group-item btn-custom2-green'>Uploaded Files</div>
                <div className='list-group-item btn-custom2-green'>Session Member</div>
            </div>
        </div>
        <PostComponent isOpen={isOpen} onRequestClose={closeModal} session_id={id} session_update={targetSession}/>
    </>
  )
}

export default SingleSession