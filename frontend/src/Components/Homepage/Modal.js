import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

const CustomModal = ({ isOpen, onRequestClose, get }) => {

    const {user, authTokens} = useContext(AuthContext)
    const [spinner, setSpinner] = useState(false)
    // console.log(user)
    let createSession = async(e)=>{
        e.preventDefault()
        setSpinner(true)
        let response = await fetch(`${BaseUrl.baseUrl}/api/new-session/`,{
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
          setSpinner(false)
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
                {/* <button type="submit" className="btn btn-custom-green ms-2">Create</button> */}
                {spinner ?
                  <button className="btn btn-primary ms-1" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="">Creating..</span>
                  </button>:
                  <button type='submit' className='btn btn-custom-green ms-2'>Create</button>
                }
              </div>
            </form>
        </div>
        
      </div>
    </Modal>
  );
};

export default CustomModal;
