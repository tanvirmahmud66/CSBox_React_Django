import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';

function LeavePopup({isOpen, onRequestClose, title,leaveSession}) {
   
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
      <div className="modal-container">
        <div className="alert alert-success text-center text-danger" role="alert">
           "{title}" - Are You want to leave this Session?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-custom-danger' onClick={onRequestClose}>cancel</button>
            <button onClick={leaveButtonHandle} className="btn btn-warning ms-2">Leave Session</button>
        </div>
      </div>
      </Modal>
  );
}

export default LeavePopup;
