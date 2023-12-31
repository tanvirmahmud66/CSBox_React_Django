import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

function PostComponent({isOpen, onRequestClose, session_id, session_update}) {

  const formRef = useRef();

  const {user,authTokens} = useContext(AuthContext)
  
  const [files, setFiles] = useState([]);

  let [spinner, setSpinner] = useState(false)


  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileRemove = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };


  let createPost = async(e)=>{
      e.preventDefault()
      setSpinner(true)
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

      let response = await fetch(`${BaseUrl.baseUrl}/api/single-session/${session_id}/`,{
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
        setSpinner(false)
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
          <form onSubmit={createPost} ref={formRef}>
            <div className="form-group">
              <textarea
                className="form-control"
                name='post_body'
                id="post_body"
                rows="10"
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
                    className="alert alert-secondary p-0 d-flex justify-content-between align-items-center mb-2"
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
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                {/* <button type="submit" className="btn btn-custom-green">Post</button> */}
                {spinner ?
                    <button className="btn btn-success" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="">Posting...</span>
                    </button>:
                    <button type="submit" className="btn btn-custom-green">Post</button>
                }
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default PostComponent;
