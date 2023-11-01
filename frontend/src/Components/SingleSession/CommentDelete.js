import Modal from 'react-modal';
import React, { useContext, useState} from 'react';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

function CommentDeletePopup({isOpen2, onRequestClose, comment, getPostComment}) {
   
    const {authTokens} = useContext(AuthContext)
    const {id, session, post_id} = comment
    let[spinner, setSpinner] = useState(false)

    let deleteComment = async()=>{
        setSpinner(true)
        let response = await fetch(`${BaseUrl.baseUrl}/api/post-comment/${session}/${post_id}/${id}/`, {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ String(authTokens?.access)
          }
        })
        if(response.status===204){
          getPostComment()
          setSpinner(false)
          onRequestClose()
        }
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
        <h2 className="card-title text-center text-danger mb-3">Delete Comment</h2>
        <div className="alert alert-warning text-center text-danger" role="alert">
            Are You want to Delete this Comment?
        </div>

        <div className="comment-card mt-3 bg-comment p-2">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                    <img
                    src={BaseUrl.baseUrl+comment.commenter.profile.profile_pic}
                    className="rounded-circle avatar"
                    alt="User Profile"
                    />
                    <div>
                      <a href={`/profile/${comment.commenter.id}`} className='text-decoration-none'>
                        <small className="text-primary">{comment.commenter.first_name} {comment.commenter.last_name}</small>
                      </a>
                      <small className='ms-1'>{comment.comment_body}</small>
                    </div>
                </div>
            </div>
        </div>
        

        <div className='d-flex justify-content-end align-items-center mt-3'>
            <button className='btn btn-secondary' onClick={onRequestClose}>Cancel</button>
            {/* <button onClick={deleteComment} className="btn btn-custom-danger ms-2">Delete</button> */}
            {spinner ?
                    <button className="btn btn-danger ms-2" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="">Deleting...</span>
                    </button>:
                    <button onClick={deleteComment} className="btn btn-custom-danger ms-2">Delete</button>
            }
        </div>
      </div>
      </Modal>
  );
}

export default CommentDeletePopup;
