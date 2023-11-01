import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import TimeAgoComponent from '../TimeAgoComponent';
import Dropdown from 'react-bootstrap/Dropdown';
import DeadlineComponent from '../DeadlineComponent';
import DateTimeComponent from '../DateTimeComponent';
import BaseUrl from '../BaseUrl';


// ===================================== Get File name
function getFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

// ===================================== open File
function openFile(url) {
    window.open(url, '_blank');
}

function AssignmentExpend({isOpen, onRequestClose, assignment, session, updateSession, allSubmission, expired}) {

    const {files, file_data} = assignment
 
  const formRef = useRef();
  const {user,authTokens} = useContext(AuthContext)
  

  const [selectedFile, setSelectedFile] = useState(files);
  const [instruction, setInstruction] = useState(true)
  const [submission, setSubmission] = useState(false)

  let [spinner, setSpinner] = useState(false)

  let instructionHandle = ()=>{
    setInstruction(true)
    setSubmission(false)
  }
  let submissionHandle = ()=>{
    setSubmission(true)
    setInstruction(false)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
  };


  let assignmentSubmit = async(e)=>{
    e.preventDefault()
    setSpinner(true)
    const formData = new FormData();
    const postPayload = {
        session:session.id,
        assignment:assignment.id,
        submit_by:user.user_id,
        file: selectedFile,
    }
    formData.append('post_data', JSON.stringify(postPayload));
    formData.append('file', selectedFile)

    let response = await fetch(`${BaseUrl.baseUrl}/api/submission/${session.id}/${assignment.id}/`,{
        method:"POST",
        headers: {
            'Authorization': 'Bearer '+ String(authTokens?.access)
        },
        body: formData
    })

    if (response.status===201){
        updateSession()
        formRef.current.reset();
        setSpinner(false)
    }
    if(response.status===302){
        alert("You can't submit your answer papper double time.")
        setSpinner(false)
    }
  }

//   console.log("user: ", user)
//   console.log("session: ", session)
//   console.log("assignment: ", assignment)
//   console.log("allSubmit: ",allSubmission)

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Example Modal"
    className="modal-content"
    overlayClassName="modal-overlay custom-backdrop"
    >
      <div className="card w-85 d-none-1200">
        <div className="card-body">
            <div className='row vh-70'>
                <div className='col-6'>
                    <div className='card-header text-center'>{assignment.title}</div>
                    <div className='mt-2'>
                        <>Created: <TimeAgoComponent dateString={assignment.created}/></>
                        <DeadlineComponent dateTimeString={assignment.deadline}/>
                    </div>
                    
                    <div className={`mt-2 ${assignment.body.length<=250? "fs-4":""}`}>{assignment.body}</div>
                    
                    {files &&
                        <div className='d-flex mt-3 justify-content-between align-items-center alert alert-primary custom-alert'>
                            <div onClick={()=>openFile(BaseUrl.baseUrl+files)} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(files)}</div>
                            <Dropdown>
                                <Dropdown.Toggle
                                size='sm' 
                                variant="" 
                                id="dropdown-basic"
                                ></Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        href={`data:application/octet-stream;base64,${file_data}`}
                                        download={getFileNameFromUrl(files)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => openFile(BaseUrl.baseUrl+files)}>Open</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>}
                </div>
                <div className='col-6'>
                    <div className='card-header text-center'>
                        {user.user_id===session.host.id ? `Submission List (${allSubmission.length})`: "Submit your paper"}
                    </div>
                    {(user.user_id !== session.host.id && !expired) &&
                        <form onSubmit={assignmentSubmit}  className='mt-3 mb-3' ref={formRef}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className='form-group w-100'>
                                    <input className="form-control" type="file" id="formFile" onChange={handleFileChange} required/>
                                </div>
                                {/* <button type="submit" className="btn btn-custom-green ms-2">Submit</button> */}
                                {spinner ?
                                    <button className="btn btn-success ms-2" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="visually-hidden">Submit...</span>
                                    </button>:
                                    <button type="submit" className="btn btn-custom-green ms-2">Submit</button>
                                }
                            </div>
                        </form>
                    }
                    {user.user_id!==session.host.id && <div className='fs-4'>Total submit {allSubmission.length}</div>}
                    <ul className={`list-group ${user.user_id===session.host.id ? "submission-container":"submission-container2"}`}>
                        
                        
                        {allSubmission.length!==0 ? 
                            <>
                                {allSubmission.map((each,index)=>{
                                    return(
                                        <small key={index}>
                                        <li  className={`${user.user_id===each.submit_by.id? "custom-list-item2":"custom-list-item"} p-2 rounded`}>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div className='d-flex align-items-center'>
                                                    <img className='avatar' src={BaseUrl.baseUrl+each.submit_by.profile.profile_pic} alt='avatar'/>
                                                    <div className='text-decoration-none'>{each.submit_by.first_name} {each.submit_by.last_name}</div>
                                                </div>
                                                <DateTimeComponent dateTimeString={each.submit_at}/>
                                            </div>
                                            <div className='mt-2'>
                                                <div className='d-flex justify-content-between align-items-center custom-alert-primary custom-alert'>
                                                    <small onClick={()=>{
                                                        if(user.user_id===each.submit_by.id || user.user_id===session.host.id){openFile(BaseUrl.baseUrl+each.file)}     
                                                    }} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(each.file)}</small>
                                                    {(user.user_id===each.submit_by.id || user.user_id===session.host.id) && 
                                                        <Dropdown variant="small">
                                                            <Dropdown.Toggle
                                                            size='sm' 
                                                            variant="small" 
                                                            id="dropdown-basic"
                                                            ></Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    href={`data:application/octet-stream;base64,${each.file_data}`}
                                                                    download={getFileNameFromUrl(each.file)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Download
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => openFile(BaseUrl.baseUrl+files)}>Open</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                        </small>     
                                    )
                                })}
                            </>:<>
                                <div className='no-post'>Empty</div>
                            </>
                            
                        }
                    </ul>
                </div>
            </div>
            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Close</button>
            </div>
        </div>
      </div>
    
      <div className='card my-card d-block-1200'>
        <div className='card-body'>
            
            <Dropdown>
              <Dropdown.Toggle className='btn d-flex justify-content-center align-items-center p-2' variant="success" id="dropdown-basic">
                <div className='me-1'>{assignment.title}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={instructionHandle} className={`${instruction && "text-success"}`}>Instruction</Dropdown.Item>
                <Dropdown.Item onClick={submissionHandle} className={`${submission && "text-success"}`}>Submission</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            {instruction &&
            <div>
                <div className='mt-2'>
                    <>Created: <TimeAgoComponent dateString={assignment.created}/></>
                    <DeadlineComponent dateTimeString={assignment.deadline}/>
                </div>
                    
                <div className={`mt-2 ${assignment.body.length<=250? "fs-4":""}`}>{assignment.body}</div>
                    
                {files &&
                    <div className='d-flex mt-3 justify-content-between align-items-center alert alert-primary custom-alert'>
                        <div onClick={()=>openFile(BaseUrl.baseUrl+files)} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(files)}</div>
                        <Dropdown>
                            <Dropdown.Toggle
                                size='sm' 
                                variant="" 
                                id="dropdown-basic"
                            ></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                        href={`data:application/octet-stream;base64,${file_data}`}
                                        download={getFileNameFromUrl(files)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                >
                                Download
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => openFile(BaseUrl.baseUrl+files)}>Open</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                }
            </div>}

            {submission &&
            <div>
                <div className='mt-2 card-header text-center'>
                    {user.user_id===session.host.id ? `Submission List (${allSubmission.length})`: "Submit your paper"}
                </div>
                    {(user.user_id !== session.host.id && !expired) &&
                        <form onSubmit={assignmentSubmit}  className='mt-3 mb-3' ref={formRef}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className='form-group w-100'>
                                    <input className="form-control" type="file" id="formFile" onChange={handleFileChange} required/>
                                </div>
                                <button type="submit" className="btn btn-custom-green ms-2">Submit</button>
                            </div>
                        </form>
                    }
                    {user.user_id!==session.host.id && <div className='fs-4'>Total submit {allSubmission.length}</div>}
                    <ul className={`list-group ${user.user_id===session.host.id ? "submission-container":"submission-container2"}`}>
                        
                        
                        {allSubmission.length!==0 ? 
                            <>
                                {allSubmission.map((each,index)=>{
                                    return(
                                        <small key={index}>
                                        <li  className={`${user.user_id===each.submit_by.id? "custom-list-item2":"custom-list-item"} p-2 rounded`}>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div className='d-flex align-items-center'>
                                                    <img className='avatar' src={BaseUrl.baseUrl+each.submit_by.profile.profile_pic} alt='avatar'/>
                                                    <div className='text-decoration-none'>{each.submit_by.first_name} {each.submit_by.last_name}</div>
                                                </div>
                                                <DateTimeComponent dateTimeString={each.submit_at}/>
                                            </div>
                                            <div className='mt-2'>
                                                <div className='d-flex justify-content-between align-items-center custom-alert-primary custom-alert'>
                                                    <small onClick={()=>{
                                                        if(user.user_id===each.submit_by.id || user.user_id===session.host.id){openFile(BaseUrl.baseUrl+each.file)}     
                                                    }} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(each.file)}</small>
                                                    {(user.user_id===each.submit_by.id || user.user_id===session.host.id) && 
                                                        <Dropdown variant="small">
                                                            <Dropdown.Toggle
                                                            size='sm' 
                                                            variant="small" 
                                                            id="dropdown-basic"
                                                            ></Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    href={`data:application/octet-stream;base64,${each.file_data}`}
                                                                    download={getFileNameFromUrl(each.file)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Download
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => openFile(BaseUrl.baseUrl+files)}>Open</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                        </small>     
                                    )
                                })}
                            </>:<>
                                <div className='no-post'>Empty</div>
                            </>
                            
                        }
                    </ul>
            </div>}

            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Close</button>
            </div>
        </div>
      </div>

      </Modal>
  );
}

export default AssignmentExpend;
