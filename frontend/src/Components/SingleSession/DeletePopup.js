import Modal from 'react-modal';
import React from 'react';
import TimeAgoComponent from '../TimeAgoComponent';
import BaseUrl from '../BaseUrl';

function DeletePopup({isOpen2, onRequestClose, Delete, post, spinner}) {
   
    const {post_body, created} = post
    const {first_name, last_name} = post.creator
    const{profile_pic} = post.creator.profile

    const DeleteButtonHandle = ()=>{
        Delete()
        onRequestClose()
    }

  return (
    <Modal
    isOpen={isOpen2}
    onRequestClose={onRequestClose}
    contentLabel="Example Modal"
    className="modal-content"
    overlayClassName="modal-overlay custom-backdrop"
    >
      <div className="card my-card p-2">
        <h2 className="card-title text-center text-danger mb-3">Delete Post</h2>
        <div className='card p-2'>
          <div className="media d-flex justify-content-between align-items-center">
              <div className='d-flex align-items-center'>
                  <img
                  src={BaseUrl.baseUrl+profile_pic}
                  className="avatar2"
                  alt="User Avatar"
                  />
                  <div className="media-body">
                    <a href={`/profile/`} className='text-decoration-none text-custom-black'>
                      <h5 className="mb-0">{first_name} {last_name}</h5>
                    </a>
                    
                    <div className='text-primary text-small'>
                      <TimeAgoComponent dateString={created}/>
                    </div> 
                  </div>
              </div>
            </div>

            <div className="card-body">
              <div className={`card-text ${post_body.length<150? 'fs-3 fw-300': ''}`}>
                {post_body}
              </div>
            </div>
        </div>
        
        <div className="mt-2 alert alert-warning text-center text-danger" role="alert">
            Are You want to Delete this post?
        </div>

        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-secondary' onClick={onRequestClose}>Cancel</button>
            {/* <button onClick={DeleteButtonHandle} className="btn btn-custom-danger ms-2">Confirm</button> */}
            {spinner ?
                <button className="btn btn-danger ms-2" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="">Deleteing...</span>
                </button>:
                <button onClick={DeleteButtonHandle} className="btn btn-custom-danger ms-2">Confirm</button>
            }
        </div>
      </div>
      </Modal>
  );
}

export default DeletePopup;
