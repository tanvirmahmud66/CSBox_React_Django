import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import TimeAgoComponent from '../TimeAgoComponent';
import DateTimeComponent from '../DateTimeComponent';
import AssginDeletePopup from './AssignDeletePopup';
import AssignEditPopup from './AssignEditPopup';


// ===================================== Get File name
function getFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

// ===================================== open File
function openFile(url) {
    window.open(url, '_blank');
}


const SingleAssignment = ({assignment, session, updateSession}) => {

  const {title ,body, created, deadline, files, file_data} = assignment
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)

  const baseUrl = 'http://127.0.0.1:8000';


  const openModal = () => {
    setIsOpen(true);
  };

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };


  return (
      <div className="card mt-3 mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
            <div>
                <div className='fs-4'>{title}</div>
                <div className='text-primary text-small'>
                    <TimeAgoComponent dateString={created}/>
                </div> 
            </div>
            <div className='d-flex align-items-center'>
                <DateTimeComponent dateTimeString={deadline}/>
                <Dropdown className='ms-1'>
                    <Dropdown.Toggle variant="" id="dropdown-basic"></Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openModal2}  href="#">Edit</Dropdown.Item>
                        <Dropdown.Item onClick={openModal}  href="#">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
        <div className="card-body">
            {body}
            {files &&
            <div className='d-flex mt-3 justify-content-between align-items-center alert alert-primary custom-alert'>
              <div onClick={()=>openFile(baseUrl+files)} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(files)}</div>
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
                    <Dropdown.Item onClick={() => openFile(baseUrl+files)}>Open</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>}
        </div>
        <AssginDeletePopup isOpen={isOpen} onRequestClose={closeModal} assignment={assignment} session={session} updateSession={updateSession}/>
        <AssignEditPopup isOpen={isOpen2} onRequestClose={closeModal2} assignment={assignment} session={session} updateSession={updateSession}/>
      </div>
  );
};

export default SingleAssignment;
