import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

function ManualFileUplaod({isOpen, onRequestClose, session_id, session_update}) {

  const formRef = useRef();

  const {authTokens} = useContext(AuthContext)
  
  const [files, setFiles] = useState([]);

  let[spinner, setSpinner] = useState(false)

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileRemove = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };


  let uploadFiles = async(e)=>{
      e.preventDefault()
      setSpinner(true)
      const formData = new FormData();
      const postPayload = {
        session: session_id,
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
          <form onSubmit={uploadFiles} ref={formRef}>
            <div className="from-group mt-2">
              <div className="mb-3">
                    <h4 htmlFor="formFile" className="form-label">Upload Files</h4>
                    <input className="form-control" type="file" name='files' id="formFile" multiple onChange={handleFileChange} required/>
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
            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                {/* <button type="submit" className="btn btn-custom-green ms-2">Upload</button> */}
                {spinner ?
                  <button className="btn btn-success ms-2" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="">Uploading...</span>
                  </button>:
                  <button type="submit" className="btn btn-custom-green ms-2">Upload</button>
                }
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default ManualFileUplaod;
