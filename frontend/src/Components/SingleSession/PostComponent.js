import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';

function PostComponent({isOpen, onRequestClose, session_id, session_update}) {

  const formRef = useRef();

  const {user,authTokens} = useContext(AuthContext)
  
  const [files, setFiles] = useState([]);


  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileRemove = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };


  let createPost = async(e)=>{
      e.preventDefault()
      const formData = new FormData();
      const postPayload = {
        session: session_id,
        post_body: e.target.post_body.value,
        creator: user.user_id
      }
      formData.append('post_data', JSON.stringify(postPayload));
      files.forEach((file)=>{
        formData.append('files', file)
      })

      let response = await fetch(`http://127.0.0.1:8000/api/single-session/${session_id}/`,{
          method: "POST",
          headers: {
              'Authorization': 'Bearer '+ String(authTokens?.access)
          },
          body: formData
      })
      let data = await response.json()
      console.log("data: ",data)
      if(response.status===201){
        session_update()
        formRef.current.reset();
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
      <div className="card bg-custom-light-dark modal-container">
        <div className="card-body">
          <h2 className="card-title mb-3">Create a New Post</h2>
          <form onSubmit={createPost} ref={formRef}>
            <div className="form-group">
              <textarea
                className="form-control"
                name='post_body'
                id="post_body"
                rows="4"
                // value={postBody}
                // onChange={handlePostBodyChange}
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>

            <div className="from-group mt-2">
              <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Upload File</label>
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
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-custom2-danger' onClick={onRequestClose}>Close</button>
                <button type="submit" className="btn btn-custom-green">Create</button>
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default PostComponent;
