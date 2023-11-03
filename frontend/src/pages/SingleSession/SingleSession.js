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
import menu from '../../assets/menu.png'
import BaseUrl from '../../Components/BaseUrl'


const SingleSession = () => {

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
    
    const [postSection, setPostSection] = useState(true)
    const [uploadedFilesSection, setUploadedFilesSection] = useState(false)
    const [assignmentSection, setAssignmentSection] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [fileUploadOpen, setFileUploadOpen] = useState(false)
    const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false)
    const [memberSection, setMemberSection] = useState(false)
    const [sessionMember, setSessionMember] = useState(true)
    const [blockMember, setBlockMember] = useState(false)

    const [due, setDue] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)




    let targetSession = async()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/single-session/${id}/`, {
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
        if(session){
            let response = await fetch(`${BaseUrl.baseUrl}/api/block-member/${session.id}/${session.token}/${user.user_id}/`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer '+ String(authTokens?.access)
                },
            })
            let data = await response.json()
            if (response.status===200){
                setBlockedList(data)
            }
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

    let sessionMemberHandle = ()=>{
        setSessionMember(true)
        setBlockMember(false)
    }

    let blockMemberHandle = ()=>{
        setBlockMember(true)
        setSessionMember(false)
    }


  return (
    <>  
        {loading? 
        <div className='w-100 vh-80 d-flex justify-content-center align-items-center'>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>:
        <div className='row timeline-height'>

            {/* ==========================left sidebar===================== */}
            <div className='col-xxl-3 mt-3'>
                <div className='card'>
                    {session &&
                    <>
                        <div className='card-header d-flex justify-content-between align-items-center'>
                            <h3>{session.title}</h3>
                            <button className="navbar-toggler d-block-1400" type="button" data-bs-toggle="collapse" data-bs-target="#sessionbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <img src={menu} width={35} alt='menu'/>
                            </button>
                        </div>

                        <div className="collapse navbar-collapse card-body d-block-1400" id="sessionbarSupportedContent">
                            <h6 className='text-p'>{session.details}</h6>
                            <Link to={`/profile/${session.host.id}`} className='text-decoration-none'>
                                <h6 className='text-p text-primary'>{session.host.first_name} {session.host.last_name} <span className='text-black'>(Admin)</span></h6>
                            </Link>
                            <h6 className=''>Token: <span className='text-success'>{session.token}</span></h6>
                            <ul className="list-group mb-2">
                                <li className="list-group-item text-center">
                                    <div onClick={()=>{
                                        setPostSection(true)
                                        setUploadedFilesSection(false)
                                        setAssignmentSection(false)
                                        setMemberSection(false)
                                    }} className={`${(postSection && !memberSection) && "text-primary"}`}>All Post</div>
                                </li>
                                <li className="list-group-item text-center">
                                    <div onClick={()=> {
                                        setPostSection(false)
                                        setUploadedFilesSection(true)
                                        setAssignmentSection(false)
                                        setMemberSection(false)
                                    }} className={`${(uploadedFilesSection && !memberSection) && "text-primary"}`}>Uploaded Files ({files.length})</div>
                                </li>
                                <li className='list-group-item text-center'>
                                    <div onClick={()=> {
                                        setPostSection(false)
                                        setUploadedFilesSection(false)
                                        setAssignmentSection(true)
                                        setMemberSection(false)
                                    }} className={`${(assignmentSection && !memberSection) && "text-primary"}`}>Assingments {(user && session &&(user.user_id!==session.host.id)) ? `(${unsubmittedAssignments.length})`:""}</div>
                                </li>
                                <li className='list-group-item text-center'>
                                    <div onClick={()=> {
                                        setMemberSection(true)
                                    }} className={`${memberSection && "text-primary"}`}>Session Member</div>
                                </li>
                                {/* <li className='list-group-item text-center'>Calendar</li> */}
                            </ul>
                        </div>
                        
                        <div className='card-body d-none-1400'>
                            <h6>{session.details}</h6>
                            <Link to={`/profile/${session.host.id}`} className='text-decoration-none'>
                                <h6 className='text-primary'>{session.host.first_name} {session.host.last_name} <span className='text-black'>(Admin)</span></h6>
                            </Link>
                            <h6 className='mt-3'>Token: <span className='ms-2 token text-white'>{session.token}</span></h6>
                        </div>
                    </>}
                </div>

                <div className='mt-4 member-height d-none-1400'>
                    <Dropdown className='mb-3'>
                        <Dropdown.Toggle className='btn btn-custom2-green d-flex justify-content-center align-items-center p-1' variant="success" id="dropdown-basic">
                            <div className='me-1'>{sessionMember? "Session Member": "Block Member"}</div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={sessionMemberHandle}>Session Member</Dropdown.Item>
                            {(user.user_id===session.host.id) &&
                                <Dropdown.Item onClick={blockMemberHandle}>Block Member</Dropdown.Item>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    {blockMember? 
                        <ul className="list-group member-container">
                            {blockList.map((each,index)=>(
                                <MemberListItem key={index} each={each} session={session} sessionUpdate={targetSession} blocked={blockMember}/>
                            ))}
                        </ul>:
                        <ul className="list-group member-container">
                            {member.map((each,index)=>(
                                <MemberListItem key={index} each={each} session={session} sessionUpdate={targetSession}/>
                            ))}
                        </ul>
                    }
                    
                </div>
                
                {memberSection &&
                    <div className='mt-3 d-block-1400'>
                        <div className='mt-4 member-height'>
                            <Dropdown className='mb-3'>
                                <Dropdown.Toggle className='btn btn-custom2-gray d-flex justify-content-center align-items-center p-1' variant="secondary" id="dropdown-basic">
                                    <div className='me-1'>{blockMember? "Block Member": "Session Member"}</div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={sessionMemberHandle}>Session Member</Dropdown.Item>
                                    {(user.user_id===session.host.id) && 
                                        <Dropdown.Item onClick={blockMemberHandle}>Block Member</Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                            {blockMember? 
                                <ul className="list-group member-container">
                                    {blockList.map((each,index)=>(
                                        <MemberListItem key={index} each={each} session={session} sessionUpdate={targetSession} blocked={blockMember}/>
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
                }
                
                
            </div>

            {/* ======================================= Middle TimeLine side bar */}
            <div className='col-xxl-6 timeline-container'>
                
                {/* ----------------- Normal Post section */}
                {postSection &&
                    <div className={`${memberSection && "d-none-1400"}`}>
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
                    <div className={`mt-3 ${memberSection && "d-none-1400"}`}>
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
                    <div className={`mt-3 ${memberSection && "d-none-1400"}`}>
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
                    <div className={`mt-3 ${memberSection && "d-none-1400"}`}>
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
            <div className='col-3 mt-3 d-none-1400'>
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