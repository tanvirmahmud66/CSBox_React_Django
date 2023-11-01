import React, { useContext, useState } from 'react';
import './comment.css'
import TimeAgoComponent from '../TimeAgoComponent'
import AuthContext from '../../context/AuthContext';
import CommentDeletePopup from './CommentDelete';
import CommentEditPopup from './CommentEdit';
import BaseUrl from '../BaseUrl';

const Comment = ({comment, getPostComment, session}) => {

  const {user} = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);




  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
      setIsOpen(false);
  };
  const openModal2 = () => {
      setIsOpen2(true);
  };

  const closeModal2 = () => {
      setIsOpen2(false);
  };

  console.log(comment)
  
  
  return (
    <>
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
                <div className='text-primary text-small'>
                  <TimeAgoComponent dateString={comment.created}/>
                </div>
            </div>
            {((user.user_id===comment.commenter.id) || (user.user_id===session.host.id)) &&
            <div className="action d-flex justify-content-between mt-2 align-items-center">
              <div className="reply px-4">
                {user.user_id===comment.commenter.id &&
                <>
                <small onClick={openModal}>Edit</small>{" "}
                <div className='dots'></div>{" "}
                </>}
                <small onClick={openModal2}>delete</small>
              </div>
            </div>}
          </div>

          <CommentDeletePopup isOpen2={isOpen2} onRequestClose={closeModal2} comment={comment} getPostComment={getPostComment}/>
          <CommentEditPopup isOpen={isOpen} onRequestClose={closeModal} comment={comment} getPostComment={getPostComment}/>
      </>
  );
};

export default Comment;
