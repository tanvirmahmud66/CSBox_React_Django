import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';

function CreateAssignmentPopup({isOpen, onRequestClose, session_id, session_update}) {

  const formRef = useRef();

  const {user,authTokens} = useContext(AuthContext)
  
  const [selectedFile, setSelectedFile] = useState();
  const [deadline, setDeadline] = useState('');
  let [spinner, setSpinner] = useState(false);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
  };

  const handleFileRemove = (fileName) => {
    setSelectedFile(null);
  };


  let createAssignment = async(e)=>{
      e.preventDefault()
      setSpinner(true)
      const formData = new FormData();
      const postPayload = {
        session: session_id,
        title: e.target.title.value,
        body: e.target.body.value,
        creator: user.user_id,
        files: selectedFile,
        deadline: deadline
      }
      formData.append('post_data', JSON.stringify(postPayload));
      formData.append('file', selectedFile)

      let response = await fetch(`${BaseUrl.baseUrl}/api/session/assignment/${session_id}/`,{
          method: "POST",
          headers: {
              'Authorization': 'Bearer '+ String(authTokens?.access)
          },
          body: formData
      })

    //   let data = await response.json()
    //   console.log("data: ",data)
      if(response.status===201){
        session_update()
        setSpinner(false)
        formRef.current.reset();
        onRequestClose()
        setSelectedFile(null);
        setDeadline('')
      }

      
      
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
          <form onSubmit={createAssignment} ref={formRef}>
            <div className="form-group">
                <input className="form-control" type="text" name='title' id="title" placeholder='Assignment Title' required/>
            </div>
            <div className="form-group mt-3">
              <textarea
                className="form-control"
                name='body'
                id="body"
                rows="6"
                placeholder="Description (Optional)"
              ></textarea>
            </div>

            <div className="from-group mt-3">
                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Upload Assignment PDF</label>
                    <input className="form-control" type="file" id="formFile" onChange={handleFileChange}/>
                </div>
              
              {selectedFile &&
              <div className="mt-2" id="selectedFiles">
                  <div className="alert alert-secondary p-0 d-flex justify-content-between align-items-center mb-2">
                    <span>{selectedFile.name}</span>
                    <button
                      type="button"
                      className="btn btn-danger"
                      aria-label="Close"
                      onClick={() => handleFileRemove(selectedFile)}
                    >
                        remove
                    </button>
                  </div>
              </div>}
            </div>
            

            <div className="form-group">
                <label htmlFor="datePicker" className='text-danger'>Submission Deadline:</label>
                <input
                    type="datetime-local"  // Use datetime-local input type for date and time
                    id="datePicker"
                    className='form-control'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                {/* <button type="submit" className="btn btn-custom-green ms-2">Create Assignment</button> */}
                {spinner ?
                  <button className="btn btn-success ms-2" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="">Creating...</span>
                  </button>:
                  <button type="submit" className="btn btn-custom-green ms-2">Create Assignment</button>
                }
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default CreateAssignmentPopup;
