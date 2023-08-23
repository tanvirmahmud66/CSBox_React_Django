import React from 'react';
import './comment.css'

const Comment = ({comment}) => {
  return (
          <div className="comment-card mt-2 bg-custom-dark p-2">
            <div className="d-flex justify-content-between align-items-center">
                <div className="user d-flex flex-row align-items-center">
                    <img
                    src="https://i.imgur.com/hczKIze.jpg"
                    width="30"
                    className="user-img rounded-circle mr-2"
                    alt="User Profile"
                    />
                    <span>
                    <small className="font-weight-bold text-primary ms-1">{comment.commenter.first_name} {comment.commenter.last_name}</small>{' '}
                    <small className="font-weight-bold">{comment.comment_body}</small>
                    </span>
                </div>
                <small>2 days ago</small>
            </div>
            <div className="action d-flex justify-content-between mt-2 align-items-center">
              <div className="reply px-4">
                <small>Remove</small>
              </div>
            </div>
          </div>
  );
};

export default Comment;
