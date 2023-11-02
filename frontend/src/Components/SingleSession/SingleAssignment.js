import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import TimeAgoComponent from '../TimeAgoComponent';
import AssginDeletePopup from './AssignDeletePopup';
import AssignEditPopup from './AssignEditPopup';
import AssignmentExpend from './AssignmentExpend';
import DeadlineComponent from '../DeadlineComponent';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import {isBefore } from 'date-fns';
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


const SingleAssignment = ({assignment, submissions ,session, updateSession, submitted}) => {

  const {user} = useContext(AuthContext)
  const {id,title ,body, created, deadline, files, file_data} = assignment
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [expend, setExpend] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  const submissionsArray = submissions.filter((submission)=> submission.assignment===id)

  
  const openModal = () => {
    setIsOpen(true);
  };

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const openExpend = ()=>{
    setExpend(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };
  
  const closeExpend = ()=>{
    setExpend(false);
  }

  const expired = (dateTimeString)=>{
    const parsedDate = new Date(dateTimeString);
    const currentDate = new Date();
    const isDeadlineExpired = isBefore(parsedDate, currentDate);
    if(isDeadlineExpired){
        setIsExpired(true)
    }else{
        setIsExpired(false)
    }
  }

  useEffect(()=>{
    expired(deadline);
  }, [])

  return (
      <div className="card mt-3 mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
            <div>
                <div className='fs-4'>{title}</div>
                <div className='deadline'>
                  <DeadlineComponent dateTimeString={deadline}/>
                </div>
                <div className='text-primary text-small'>
                    <TimeAgoComponent dateString={created}/>
                </div> 
            </div>
            <div className='d-flex align-items-center'>
                <div className='d-none-550'>
                  {submitted ?<div className='text-green'>Sumitted</div>:<DeadlineComponent dateTimeString={deadline}/>}
                </div>
                {user.user_id===session.host.id &&
                <Dropdown className='ms-1'>
                    <Dropdown.Toggle variant="" id="dropdown-basic"></Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openModal2}  href="#">Edit</Dropdown.Item>
                        <Dropdown.Item onClick={openModal}  href="#">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
            </div>
        </div>
        <div className="card-body pb-0">
            <div className='p-2 mb-2 ps-0'>{body}</div>
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
        <div className='card-footer'>
            <button onClick={openExpend} className='w-100 btn btn-custom-green'>Expend</button>
        </div>
        <AssginDeletePopup isOpen={isOpen} onRequestClose={closeModal} assignment={assignment} session={session} updateSession={updateSession}/>
        <AssignEditPopup isOpen={isOpen2} onRequestClose={closeModal2} assignment={assignment} session={session} updateSession={updateSession}/>
        <AssignmentExpend isOpen={expend} onRequestClose={closeExpend} assignment={assignment} session={session} updateSession={updateSession} allSubmission={submissionsArray} expired={isExpired}/>
      </div>
  );
};

export default SingleAssignment;
