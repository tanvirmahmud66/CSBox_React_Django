import Modal from 'react-modal';
import React from 'react';

function UnblockMemberPopup({isOpen, onRequestClose, unblockMember ,member}) {
   
    const removeBtnHandle = ()=>{
      unblockMember()
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
      <div className="card w-40 p-2">
        <div className="alert alert-success text-center text-primary" role="alert">
           Are you want to unblock <span className='text-danger'>{member.member.first_name} {member.member.last_name}</span>?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-danger' onClick={onRequestClose}>Cancel</button>
            <button onClick={removeBtnHandle} className="btn btn-primary ms-2">Unblock</button>
        </div>
      </div>
      </Modal>
  );
}

export default UnblockMemberPopup;
