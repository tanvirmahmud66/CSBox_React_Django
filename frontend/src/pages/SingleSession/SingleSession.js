import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostComponent from '../../Components/SingleSession/PostComponent'
import AuthContext from '../../context/AuthContext'
import SinglePost from '../../Components/SingleSession/SinglePost'
import FileDownloadComponent from '../../Components/SingleSession/FileDownload'
import Dropdown from 'react-bootstrap/Dropdown';
import MemberListItem from '../../Components/SingleSession/MemberListItem'
import ManualFileUplaod from '../../Components/SingleSession/ManualFileUpload'
import CreateAssignmentPopup from '../../Components/SingleSession/CreateAssignment'
import SingleAssignment from '../../Components/SingleSession/SingleAssignment'
import DeadlineComponent from '../../Components/DeadlineComponent'


const SingleSession = () => {

    const baseUrl = 'http://127.0.0.1:8000';
    const {id} = useParams()
    const {user, authTokens} = useContext(AuthContext)

    const [session, setSession] = useState()
    const [posts, setPosts] = useState([])
    const [files, setFiles] = useState([])
    const [member, setMember] = useState([])
    const [blockList, setBlockedList] = useState([])
    const [assignments, setAssignments] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [submittedAssignments, setSubmittedAssignments] = useState([])
    const [unsubmittedAssignments, setUnsubmittedAssignments] = useState([])
    
    const [blocked, setBlocked] = useState(false)
    const [postSection, setPostSection] = useState(true)
    const [uploadedFilesSection, setUploadedFilesSection] = useState(false)
    const [assignmentSection, setAssignmentSection] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [fileUploadOpen, setFileUploadOpen] = useState(false)
    const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false)

    const [due, setDue] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)

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
            setAssignments(data.assignments)
            setSubmissions(data.submissions)
            setSubmittedAssignments(data.submitted_assignment)
            setUnsubmittedAssignments(data.unsubmitted_assignment)
            setLoading(false)
        }
    }

    let getBlockMember = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/block-member/${session?.id}/${session?.token}/${user.user_id}/`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
        })
        let data = await response.json()
        if (response.status===200){
            console.log(data)
            setBlockedList(data)
        }
    }



    useEffect(()=>{
        targetSession()
    },[])

    useEffect(()=>{
        getBlockMember()
    },[session])


    // useEffect(()=>{
    //     let interval = setInterval(() => {
    //         targetSession()
    //     },12000);
    //     return ()=> clearInterval(interval)
    // },[])




    const openModal = () => {
        setIsOpen(true);
    };

    const openFileUplaodModal = () =>{
        setFileUploadOpen(true)
    }

    const openCreateAssignmentModal = () => {
        setCreateAssignmentOpen(true)
    }
    


    const closeModal = () => {
        setIsOpen(false);
    };

    const closeFileUplaodModal = ()=> {
        setFileUploadOpen(false)
    }

    const closeCreateAssignmentModal = () =>{
        setCreateAssignmentOpen(false)
    }

    const dueButtonHandle = ()=>{
        setDue(true)
        setSubmitted(false)
    }
    const submitButtonHandle = ()=>{
        setSubmitted(true)
        setDue(false)
    }

    // console.log(session)

  return (
    <>  
        {loading? 
        <div className='w-100 vh-80 d-flex justify-content-center align-items-center'>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>:
        <div className='row timeline-height'>

            {/* ==========================left sidebar===================== */}
            <div className='col-3 mt-3'>
                <div className='card'>
                    {session &&
                    <>
                        <div className='card-header'>
                            <h3>{session.title}</h3>
                        </div>
                        <div className='card-body'>
                            <h6>{session.details}</h6>
                            <Link to={`/profile/${session.host.id}`} className='text-decoration-none'>
                                <h6 className='text-primary'>{session.host.first_name} {session.host.last_name} <span className='text-black'>(Admin)</span></h6>
                            </Link>
                            <h6 className='mt-3'>Token: <span className='ms-2 token text-white'>{session.token}</span></h6>
                        </div>
                    </>}
                </div>

                <div className='mt-4 member-height'>
                    <div className='d-flex justify-content-between mb-1'>
                        <div onClick={()=>setBlocked(false)} className={`cursor-pointer ${!blocked && "text-green"}`}>Session Member</div>
                        <div onClick={()=>setBlocked(true)} className={`cursor-pointer ${blocked && "text-danger"}`}>Blocked Member ({blockList.length})</div>
                    </div>
                    {blocked? 
                        <ul className="list-group member-container">
                            {blockList.map((each,index)=>(
                                <MemberListItem key={index} each={each} session={session} sessionUpdate={targetSession} blocked={blocked}/>
                            ))}
                        </ul>:
                        <ul className="list-group member-container">
                            {member.map((each,index)=>(
                                <MemberListItem key={index} each={each} session={session} sessionUpdate={targetSession}/>
                            ))}
                        </ul>
                    }
                    
                </div>
                
                
            </div>

            {/* ======================================= Middle TimeLine side bar */}
            <div className='col-6 timeline-container'>
                
                {/* ----------------- Normal Post section */}
                {postSection &&
                    <div>
                        <button className='btn btn-custom-green w-100 mt-3' onClick={openModal}>Create New Post</button>
                        {posts.length!==0 ?
                        <>
                            {posts.map((each, index)=>{
                                return(
                                    <SinglePost key={index} post={each} sessionUpdate={targetSession} session={session} files={files}/>
                                )
                            })}
                        </>:
                            <div className='no-post'>Create post</div>
                        }
                    </div>
                }

                {/* ----------------------- all files and upload file manually */}
                {uploadedFilesSection &&
                    <div className='mt-3'>
                        <button onClick={openFileUplaodModal} className='w-100 btn btn-custom-green mb-3'>Upload Files Manually</button>
                        <div className='uploaded-container card'>
                            {files.length!==0?
                                <FileDownloadComponent files={files} session={session} sessionUpdate={targetSession}/>:
                                <div className='no-files'>Upload files</div>
                            }
                        </div>
                        
                    </div> 
                }

                {/* ------------------------ Assignment Section */}
                {(assignmentSection && user.user_id!==session.host.id) &&
                    <div className='mt-3'>
                        {user.user_id===session.host.id ?
                            <button onClick={openCreateAssignmentModal} className='btn btn-custom-green w-100'>Create Assignment</button>:
                            <div className='w-100 row ms-0'>
                                <div onClick={dueButtonHandle} className={`col btn  ${due?"btn-custom-danger":"btn-custom2-danger"}`}>Due ({unsubmittedAssignments.length})</div>
                                <div onClick={submitButtonHandle} className={`col btn ms-1 ${submitted?"btn-custom-green":"btn-custom2-green"}`}>Submitted ({submittedAssignments.length})</div>
                            </div>
                        }
                        {(due && unsubmittedAssignments.length!==0)&&
                            <>
                                {unsubmittedAssignments.map((each, index)=>{
                                    return(
                                        <SingleAssignment key={index} assignment={each} submissions={submissions} session={session} updateSession={targetSession}/>
                                    )
                                })}
                                
                            </>
                        }
                        {(submitted && submittedAssignments.length!==0)&&
                            <>
                                {submittedAssignments.map((each, index)=>{
                                    return(
                                        <SingleAssignment key={index} assignment={each} submissions={submissions} session={session} updateSession={targetSession} submitted={true}/>
                                    )
                                })}
                                
                            </>
                        }
                    </div> 
                }

                {(assignmentSection && user.user_id===session.host.id) &&
                    <div className='mt-3'>
                        {user.user_id===session.host.id &&
                            <button onClick={openCreateAssignmentModal} className='btn btn-custom-green w-100'>Create Assignment</button>
                        }
                        {assignments.length!==0?
                            <>
                                {assignments.map((each, index)=>{
                                    return(
                                        <SingleAssignment key={index} assignment={each} submissions={submissions} session={session} updateSession={targetSession}/>
                                    )
                                })}
                                
                            </>
                        :
                            <div className='no-post'>No assignment</div>
                        }
                    </div> 
                }
                
            </div>


            {/* ====================================== Right secton handling list */}
            <div className='col-3 mt-3'>
                <div className='list-group'>
                    <div onClick={()=>{
                        setPostSection(true)
                        setUploadedFilesSection(false)
                        setAssignmentSection(false)
                    }} className={`list-group-item cursor-pointer list-btn ${postSection && "active"}`}>All Posts</div>
                    <div onClick={()=> {
                        setPostSection(false)
                        setUploadedFilesSection(true)
                        setAssignmentSection(false)
                    }} className={`list-group-item cursor-pointer list-btn ${uploadedFilesSection && "active"}`}>Uploaded Files ({files.length})</div>
                    <div onClick={()=> {
                        setPostSection(false)
                        setUploadedFilesSection(false)
                        setAssignmentSection(true)
                    }} className={`list-group-item cursor-pointer list-btn ${assignmentSection && "active"}`}>Assingments {(user && session &&(user.user_id!==session.host.id)) ? `(${unsubmittedAssignments.length})`:""}</div>
                </div>

                <div className='mt-4'>
                    <h5>Calendar</h5>
                    {((assignments && user && session) && user.user_id===session.host.id) &&
                        <ul className='list-group'>
                            {assignments.map((each, index)=>{
                                return(
                                    <li className='list-group-item' key={index}>
                                        <div>{each.title}</div>
                                        <DeadlineComponent dateTimeString={each.deadline}/>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                    {((unsubmittedAssignments && user && session) && user.user_id!==session.host.id)&&
                        <ul className='list-group'>
                        {unsubmittedAssignments.map((each, index)=>{
                            return(
                                <li className='list-group-item' key={index}>
                                    <div>{each.title}</div>
                                    <DeadlineComponent dateTimeString={each.deadline}/>
                                </li>
                            )
                        })}
                    </ul>
                    }
                </div>
            </div>
        </div>}
        <PostComponent isOpen={isOpen} onRequestClose={closeModal} session_id={id} session_update={targetSession}/>
        <ManualFileUplaod isOpen={fileUploadOpen} onRequestClose={closeFileUplaodModal} session_id={id} session_update={targetSession}/>
        <CreateAssignmentPopup isOpen={createAssignmentOpen} onRequestClose={closeCreateAssignmentModal} session_id={id} session_update={targetSession}/>
    </>
  )
}

export default SingleSession