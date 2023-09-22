import Modal from 'react-modal';
import React from 'react';

function BlockMemberPopup({isOpen, onRequestClose, blockMember ,member}) {
   
    const removeBtnHandle = ()=>{
      blockMember()
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
        <div className="alert alert-success text-center text-danger" role="alert">
           Are you want to Block <span className='text-primary'>{member.member.first_name} {member.member.last_name}</span>?
        </div>
        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-primary' onClick={onRequestClose}>Cancel</button>
            <button onClick={removeBtnHandle} className="btn btn-custom-danger ms-2">Block User</button>
        </div>
      </div>
      </Modal>
  );
}

export default BlockMemberPopup;
