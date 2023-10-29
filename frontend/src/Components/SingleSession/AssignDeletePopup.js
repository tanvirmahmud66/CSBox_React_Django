import Modal from 'react-modal';
import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function AssginDeletePopup({isOpen, onRequestClose, assignment, session, updateSession}) {
    
    const {user, authTokens} = useContext(AuthContext)

    let deleteAssignment = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/session/single-assignment/${session.id}/${assignment.id}/`,{
            method: "DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        if (response.status===204){
            updateSession()
            onRequestClose()
        }
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
        <h2 className="card-title text-center text-danger mb-3">Delete Assignment</h2>
        <div className="alert alert-warning text-center text-danger" role="alert">
            Are You want to Delete this <span className='text-primary'>{assignment.title}</span> ?
        </div>
        

        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-secondary' onClick={onRequestClose}>Cancel</button>
            <button onClick={deleteAssignment} className="btn btn-custom-danger ms-2">Confirm</button>
        </div>
      </div>
      </Modal>
  );
}

export default AssginDeletePopup;
