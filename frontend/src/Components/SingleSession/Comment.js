import React from 'react';
import './comment.css'
import TimeAgoComponent from '../TimeAgoComponent'
import DefaultPic from '../../assets/defaultPic.jpeg'

const Comment = ({comment}) => {
  const baseUrl = 'http://127.0.0.1:8000';
  console.log(comment)
  return (
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
                      <small className='ms-1'>{comment.comment_body}</small>
                    </div>
                </div>
                <div className='text-primary text-small'>
                  <TimeAgoComponent dateString={comment.created}/>
                </div>
            </div>
            <div className="action d-flex justify-content-between mt-2 align-items-center">
              <div className="reply px-4">
                <small>Edit</small>{" "}
                <div className='dots'></div>{" "}
                <small>delete</small>
              </div>
            </div>
          </div>
  );
};

export default Comment;
