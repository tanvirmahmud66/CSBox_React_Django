import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';

function DeletePopup({isOpen, onRequestClose, title, deleteSession}) {
   
    const DeleteButtonHandle = ()=>{
        deleteSession()
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
           "{title}" - Are You want to Delete this Session?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-custom2-primary' onClick={onRequestClose}>cancel</button>
            <button onClick={DeleteButtonHandle} className="btn btn-custom2-danger ms-2">Delete</button>
        </div>
      </div>
      </Modal>
  );
}

export default DeletePopup;
