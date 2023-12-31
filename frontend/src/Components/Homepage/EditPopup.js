import React, { useContext, useRef, useState } from 'react';
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const EditModal = ({ isOpen, onRequestClose, session, sessionUpdate}) => {

    const formRef = useRef();
    const {title, details,} = session;
    const {authTokens} = useContext(AuthContext)
    const[sessionTitle, setSessionTitle] = useState(title)
    const[sessionDetails, setSessionDetails] = useState(details)

    let [spinner, setSpinner] = useState(false)

    const handleSessionTitle = (event) =>{
        setSessionTitle(event.target.value)
    }
    const handleSessionDetails = (event)=>{
        setSessionDetails(event.target.value)
    }

    let editSession = async(e)=>{
        e.preventDefault()
        setSpinner(true)
        const formData = new FormData();
        const postPayload = {
            title: sessionTitle,
            details: sessionDetails 
        }
        formData.append('session_data', JSON.stringify(postPayload));
        let response = await fetch(`${BaseUrl.baseUrl}/api/single-session/${session.id}/`,{
            method: "PUT",
            headers: {
                'Authorization': 'Bearer '+String(authTokens?.access)
            },
            body: formData
        })
        let data = await response.json()
        console.log(data)
        if (response.status===200){
            sessionUpdate()
            setSpinner(false)
            formRef.current.reset();
        }
        onRequestClose()
    }


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="card my-card">
        <div className='card-header'>
            <h2 className='text-center'>Edit Session</h2>
        </div>
        <div className='card-body'>
        <form onSubmit={editSession} ref={formRef}>
              <div className="form-group mb-2">
                <label htmlFor="title">Session Title</label>
                <input 
                    type="text" 
                    name='title' 
                    className="form-control" 
                    id="title"
                    value={sessionTitle}
                    onChange={handleSessionTitle}
                    placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                 <label htmlFor="description">Description:</label>
                 <input 
                    name='description' 
                    className="form-control" 
                    id="description" 
                    rows="4"
                    value={sessionDetails}
                    onChange={handleSessionDetails}
                ></input>
             </div>
              
              <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                {/* <button type="submit" className="btn btn-custom-green ms-2">Edit Session</button> */}
                {spinner ?
                    <button className="btn btn-success ms-2" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="">Editing...</span>
                    </button>:
                    <button type="submit" className="btn btn-custom-green ms-2"> <FontAwesomeIcon icon={faEdit}/> Edit Session</button>
                }
              </div>
            </form>
        </div>
        
      </div>
    </Modal>
  );
};

export default EditModal;
