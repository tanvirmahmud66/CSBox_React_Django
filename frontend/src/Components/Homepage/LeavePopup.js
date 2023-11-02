import Modal from 'react-modal';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function LeavePopup({isOpen, onRequestClose, title,leaveSession, spinner}) {
   
    const leaveButtonHandle = ()=>{
        leaveSession()
        onRequestClose()
    }

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Example Modal"
    className="modal-content"
    overlayClassName="modal-overlay custom-backdrop"
    >
      <div className="modal-container card my-card">
        <div className='card-header'>
            <h2 className='text-center'>Leave Session</h2>
        </div>
        <div className="alert alert-success text-center text-danger" role="alert">
           "{title}" - Are You want to leave this Session?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-custom-danger' onClick={onRequestClose}>cancel</button>
            {/* <button onClick={leaveButtonHandle} className="btn btn-warning ms-2">Leave Session</button> */}
            {spinner ?
                <button className="btn btn-warning ms-2" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="">Leaving...</span>
                </button>:
                <button onClick={leaveButtonHandle} className="btn btn-warning ms-2"><FontAwesomeIcon icon={faSignOutAlt} /> Leave Session</button>
            }
        </div>
      </div>
      </Modal>
  );
}

export default LeavePopup;
