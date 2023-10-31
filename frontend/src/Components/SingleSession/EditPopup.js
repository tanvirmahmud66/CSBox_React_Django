import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';

function EditPopup({isOpen, onRequestClose, post, session, sessionUpdate}) {

    

  const formRef = useRef();
  const {user,authTokens} = useContext(AuthContext)
  const session_id = session.id
  const {id,post_body,} = post
  const [postBody, setPostBody] = useState(post_body)
  const [files, setFiles] = useState([]);
  let [spinner, setSpinner] = useState(false);


  const handlePostBodyChange = (event) => {
    setPostBody(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileRemove = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };



  let updatePost = async(e)=>{
      e.preventDefault()
      setSpinner(true)
      const formData = new FormData();
      const postPayload = {
        post_body: postBody,
        creator: user.user_id
      }
      formData.append('post_data', JSON.stringify(postPayload));
      files.forEach((file)=>{
        formData.append('files', file)
      })

      let response = await fetch(`http://127.0.0.1:8000/api/single-post/${session_id}/${id}/`,{
          method: "PUT",
          headers: {
              'Authorization': 'Bearer '+ String(authTokens?.access)
          },
          body: formData
      })
      // let data = await response.json()
      // console.log("data: ",data)
      if(response.status===200){
        sessionUpdate()
        formRef.current.reset();
        setSpinner(false)
        setFiles([])
      }
      onRequestClose()
      
  };

   

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Example Modal"
    className="modal-content"
    overlayClassName="modal-overlay custom-backdrop"
    >
      <div className="card my-card">
        <div className="card-body">
          <h2 className="card-title text-center text-green mb-3">Edit Post</h2>
          <form onSubmit={updatePost} ref={formRef}>
            <div className="form-group">
              <textarea
                className="form-control"
                name='post_body'
                id="post_body"
                rows="10"
                value={postBody}
                onChange={handlePostBodyChange}
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>

            <div className="from-group mt-2">
              <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Upload more files</label>
                    <input className="form-control" type="file" name='files' id="formFile" multiple onChange={handleFileChange}/>
                </div>
              
              <div className="mt-2" id="selectedFiles">
                {files.map(file => (
                  <div
                    className="alert alert-secondary d-flex justify-content-between align-items-center mb-2"
                    key={file.name}
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="btn btn-danger"
                      aria-label="Close"
                      onClick={() => handleFileRemove(file.name)}
                    >
                        remove
                    </button>
                  </div>
                ))}
              </div>

            </div>
            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                {/* <button type="submit" className="btn btn-custom-green ms-2">Update</button> */}
                {spinner ?
                    <button className="btn btn-success ms-2" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="">Updating...</span>
                    </button>:
                    <button type="submit" className="btn btn-custom-green ms-2">Update</button>
                }
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default EditPopup;
