import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostComponent from '../../Components/SingleSession/PostComponent'
import AuthContext from '../../context/AuthContext'
import SinglePost from '../../Components/SingleSession/SinglePost'
import FileDownloadComponent from '../../Components/SingleSession/FileDownload'

const SingleSession = () => {
    const {id} = useParams()

    const {authTokens} = useContext(AuthContext)

    const [isOpen, setIsOpen] = useState(false);

    const [session, setSession] = useState()
    const [posts, setPosts] = useState([])
    const [files, setFiles] = useState([])
    const [member, setMember] = useState([])

    const [sessionTitle, setSessionTitle] = useState()
    const [host, setHost] = useState()
    const [sessionDetails, setSessionDetails] = useState()
    const [sessionToken, setSessionToken] = useState()   

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
            console.log(data)
            setSession(data.session)
            setSessionTitle(data.session.title)
            setHost(data.session.host.username)
            setSessionDetails(data.session.details)
            setSessionToken(data.session.token)
            setPosts(data.posts)
            setFiles(data.files)
            setMember(data.members)
        }
    }
 

    useEffect(()=>{
        targetSession()
    },[])


    const openModal = () => {
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };

  return (
    <>  
        <div className='row mt-3'>
            <div className='col-3'>
                <div className='card bg-custom-light-dark'>
                    <div className='card-header'>
                        <h3>{sessionTitle}</h3>
                    </div>
                    <div className='card-body'>
                        <h6>Details: {sessionDetails}</h6>
                        <h6>Host: {host}</h6>
                        <h6 className='mt-3'>Token: <span className='ms-2 token'>{sessionToken}</span></h6>
                    </div>
                </div>
                <div className='mt-4'>
                    <h5 className="mb-3">List of Session Member</h5>
                    <ul className="list-group">
                        {member.map((each,index)=>(
                            <li key={index} className="list-group-item bg-custom-light-dark d-flex justify-content-between align-items-center">
                                <div>{each.member.first_name} {each.member.last_name}</div>
                                <a href={`/profile/${each.member.id}`}>profile</a>
                            </li>
                        ))}
                    </ul>
                </div>
                
            </div>
            <div className='col-6'>
                <button className='btn btn-custom-green w-100' onClick={openModal}>Create New Post</button>

                {posts.map((each, index)=>{
                    return(
                        <SinglePost key={index} post={each} sessionUpdate={targetSession} session={session} files={files}/>
                    )
                })}
            </div>
            <div className='col-3'>
                <div className='custom-card-heading bg-custom-light-dark'>Uploaded Files</div>
                {/* <FileDownloadComponent files={files}/> */}
            </div>
        </div>
        <PostComponent isOpen={isOpen} onRequestClose={closeModal} session_id={id} session_update={targetSession}/>
    </>
  )
}

export default SingleSession