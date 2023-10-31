import Modal from 'react-modal';
import React from 'react';

function DeletePopup({isOpen, onRequestClose, title, deleteSession, spinner}) {
   
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
      <div className="card my-card p-2">
        <div className='card-header'>
            <h2 className='text-center'>Delete Session</h2>
        </div>
        <div className="alert alert-success text-center text-danger" role="alert">
           "{title}" - Are You want to Delete this Session?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-primary' onClick={onRequestClose}>Cancel</button>
            {/* <button onClick={DeleteButtonHandle} className="btn btn-custom-danger ms-2">Delete</button> */}
            {spinner ?
                <button className="btn btn-danger ms-2" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="">Deleteing...</span>
                </button>:
                <button onClick={DeleteButtonHandle} className="btn btn-custom-danger ms-2">Delete</button>
            }
        </div>
      </div>
      </Modal>
  );
}

export default DeletePopup;
