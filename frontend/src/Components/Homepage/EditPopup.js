import React, { useContext, useRef, useState } from 'react';
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';

const EditModal = ({ isOpen, onRequestClose, session, sessionUpdate}) => {

    const formRef = useRef();
    const {title, details,} = session;
    const {user, authTokens} = useContext(AuthContext)
    const[sessionTitle, setSessionTitle] = useState(title)
    const[sessionDetails, setSessionDetails] = useState(details)

    const handleSessionTitle = (event) =>{
        setSessionTitle(event.target.value)
    }
    const handleSessionDetails = (event)=>{
        setSessionDetails(event.target.value)
    }

    let editSession = async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        const postPayload = {
            title: sessionTitle,
            details: sessionDetails 
        }
        formData.append('session_data', JSON.stringify(postPayload));
        let response = await fetch(`http://127.0.0.1:8000/api/single-session/${session.id}/`,{
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
      <div className="text-white modal-container">
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
                    className="form-control bg-dark text-white" 
                    id="title"
                    value={sessionTitle}
                    onChange={handleSessionTitle}
                    placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                 <label htmlFor="description">Description:</label>
                 <textarea 
                    name='description' 
                    className="form-control form-control-sm bg-dark text-white" 
                    id="description" 
                    rows="4"
                    value={sessionDetails}
                    onChange={handleSessionDetails}
                ></textarea>
             </div>
              
              <div className='d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-custom2-danger' onClick={onRequestClose}>Close</button>
                <button type="submit" className="btn btn-custom-green">Edit Session</button>
              </div>
            </form>
        </div>
        
      </div>
    </Modal>
  );
};

export default EditModal;
