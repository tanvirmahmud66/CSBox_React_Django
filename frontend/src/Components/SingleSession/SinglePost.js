import React, { useContext, useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import FileDownloadComponent from './FileDownload';
import AuthContext from '../../context/AuthContext';
import DeletePopup from './DeletePopup';
import EditPopup from './EditPopup';
import Comment from './Comment';
import DefaultPic from '../../assets/defaultPic.jpeg'

const SinglePost = ({post, session ,files, sessionUpdate}) => {

  const {user, authTokens} = useContext(AuthContext)
  const formRef = useRef()
  const session_id = session.id
  const {id,post_body, creator} = post
  const {first_name, last_name} = post.creator
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false)
  const [commentShow, setCommentShow] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

    

  const filesArray = files.filter((file)=>file.post_id===id)
  

  let postDelete = async()=>{
    let response = await fetch(`http://127.0.0.1:8000/api/single-post/${session_id}/${id}/`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ String(authTokens?.access)
        }
    })
    let data = await response.json()
    // console.log("Delete: ",data)
    if(response.status===200){
        sessionUpdate()
    }
  }

  let getPostComment = async ()=>{
    let response = await fetch(`http://127.0.0.1:8000/api/post-comment/${session_id}/${id}/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ String(authTokens?.access)
        }
    })
    let data = await response.json()
    // console.log(data)
    setComments(data)
  }



  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    let response = await fetch(`http://127.0.0.1:8000/api/post-comment/${session_id}/${id}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ String(authTokens?.access)
        },
        body: JSON.stringify({
            'commenter': user.user_id,
            'post_id': id,
            'session': session_id,
            'comment_body': e.target.comment.value,
        })
    })
    let data = await response.json()
    formRef.current.reset();
    getPostComment()
    setCommentShow(true)
    console.log(data)
  };

  
  useEffect(()=>{
    getPostComment()
  }, [])
  
  const handleShow = ()=>{
    setShow(!show)
  }

  const commentsButtonHandle = ()=>{
    setCommentShow(!commentShow)
  }

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


  return (
      <div className="card mt-4">
        <div className="card-header">
          <div className="media d-flex justify-content-between align-items-center">
            <div className='d-flex align-items-center'>
                <img
                src={DefaultPic}
                className="mr-1 rounded-circle avatar"
                alt="User Avatar"
                />
                <div className="media-body">
                <h5 className="mb-0 ms-2">{first_name} {last_name}</h5>
                </div>
            </div>
            {(user.user_id===session.host.id || user.user_id===creator.id) &&
                <Dropdown className='p-2'>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {user.user_id===creator.id && <Dropdown.Item onClick={openModal} href="#">Edit</Dropdown.Item>}
                        <Dropdown.Item onClick={openModal2} href="#">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
            
          </div>
        </div>
        <div className="card-body">
          <div className={`card-text ${post_body.length<150? 'fs-3': ''}`}>
            {post_body}
          </div>
        </div>

        {show && <FileDownloadComponent files={filesArray} post={post} sessionUpdate={sessionUpdate} />}
        {filesArray.length!==0 && <button className='btn btn-secondary' onClick={handleShow}>{show? "Hide files":`${filesArray.length} files show`}</button> }
        
        
        <div className="card-footer bg-custom-light-white mt-2">
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <div onClick={commentsButtonHandle} className="custom-cursor-pointer text-primary">{!commentShow?`All comments`: "Hide comments"} </div>
            <div>{comments.length} comments</div>
          </div>
          {commentShow && comments.map((comment, index) => (
               <Comment key={index} comment={comment}/>
          ))}

        </div>
        <div className="card-footer bg-custom-light-white">
          <form onSubmit={handleCommentSubmit} className="input-group" ref={formRef}>
            <input 
                type="text" 
                className="form-control"
                name='comment' 
                placeholder="comment here..." 
                aria-label="search" 
                aria-describedby="button-addon2"
            />
            <button 
                className="btn btn-primary" 
                type="submit" 
                id="button-addon2"
            >Add Comment</button>

          </form>
        </div>

            <DeletePopup isOpen2={isOpen2} onRequestClose={closeModal2} Delete={postDelete}/>
            <EditPopup isOpen={isOpen} onRequestClose={closeModal} post={post} session={session} sessionUpdate={sessionUpdate}/>
      </div>
  );
};

export default SinglePost;
