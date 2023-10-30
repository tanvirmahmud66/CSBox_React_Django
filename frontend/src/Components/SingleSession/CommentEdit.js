import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';
import TimeAgoComponent from '../TimeAgoComponent';

function CommentEditPopup({isOpen, onRequestClose, comment, getPostComment}) {
   
    const baseUrl = 'http://127.0.0.1:8000';
    const {authTokens} = useContext(AuthContext)
    const {id, session, post_id} = comment
    const [commentBody, setCommentBody] = useState(comment.comment_body)

    const handleCommentBodyChange = (event) => {
        setCommentBody(event.target.value);
    };

    let editComment = async(e)=>{
        e.preventDefault()
        let response = await fetch(`http://127.0.0.1:8000/api/post-comment/${session}/${post_id}/${id}/`, {
          method: "PUT",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ String(authTokens?.access)
          },
          body: JSON.stringify({
            'comment_body': commentBody
          })
        })
        if(response.status===200){
          getPostComment()
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
        <div className='card-header fs-4'>Edit Comment</div>

        <div className="comment-card mt-3 bg-comment p-2">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                    <img
                    src={baseUrl+comment.commenter.profile.profile_pic}
                    className="rounded-circle avatar"
                    alt="User Profile"
                    />
                    <div>
                      <a href={`/profile/${comment.commenter.id}`} className='text-decoration-none'>
                        <small className="text-primary">{comment.commenter.first_name} {comment.commenter.last_name}</small>
                      </a>
                    </div>
                    
                </div>
            </div>
            <form className='mt-2' onSubmit={editComment}>
                <input 
                    type="text" 
                    className="form-control w-100"
                    name='comment' 
                    placeholder="comment here..." 
                    aria-label="search" 
                    aria-describedby="button-addon2"
                    value={commentBody}
                    onChange={handleCommentBodyChange}
                />
                <div className='d-flex justify-content-end align-items-center mt-3'>
                    <button className='btn btn-danger' onClick={onRequestClose}>Cancel</button>
                    <button type='submit' className="btn btn-custom-green ms-2">Edit Comment</button>
                </div>
            </form>
        </div>
      </div>
    </Modal>
  );
}

export default CommentEditPopup;
