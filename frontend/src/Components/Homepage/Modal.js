import React, { useContext } from 'react';
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';

const CustomModal = ({ isOpen, onRequestClose, get }) => {

    const {user, authTokens} = useContext(AuthContext)
    // console.log(user)
    let createSession = async(e)=>{
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/new-session/',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
            body: JSON.stringify({
                "title": e.target.title.value,
                "details": e.target.description.value,
                "host": user.user_id,
            })
        })

        let data = await response.json()
        console.log(data)
        if(response.status===201){
          get()
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
            <h2 className=''>New Session</h2>
        </div>
        <div className='card-body'>
        <form onSubmit={createSession}>
              <div className="form-group mb-2">
                <input type="text" name='title' className="form-control" id="title" placeholder="Session Title" required/>
              </div>
              <div className="form-group">
                 <input name='description' className="form-control" placeholder='A short description' id="description" rows="4"></input>
             </div>
              
              <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Close</button>
                <button type="submit" className="btn btn-custom-green ms-2">Create</button>
              </div>
            </form>
        </div>
        
      </div>
    </Modal>
  );
};

export default CustomModal;
