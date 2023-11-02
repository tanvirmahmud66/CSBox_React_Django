import Modal from 'react-modal';
import React, { useContext, useState , useRef, useEffect} from 'react';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../BaseUrl';



function AssignEditPopup({isOpen, onRequestClose, assignment, session, updateSession}) {

  const formRef = useRef();
  const {authTokens} = useContext(AuthContext)
  const {files} = assignment
  
  const[title, setTitle] = useState(assignment.title)
  const[body, setBody] = useState(assignment.body)
  const [selectedFile, setSelectedFile] = useState(files);

  const [deadline, setDeadline] = useState('');

  let [spinner, setSpinner] = useState(false)

  useEffect(() => {
    if (assignment.deadline) {
      const deadlineDate = new Date(assignment.deadline);
      const formattedDeadline = deadlineDate.toISOString().slice(0, 16);
      setDeadline(formattedDeadline);
    }
  }, [assignment.deadline]);


  const handleTitleChange = (event) =>{
    setTitle(event.target.value)
  }

  const handleBodyChange = (event)=>{
    setBody(event.target.value)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
  };

  const handleFileRemove = (fileName) => {
    setSelectedFile(null);
  };

  

  let editAssignment = async(e)=>{
    e.preventDefault()
    setSpinner(true)
    const formData = new FormData();
    const putPayload = {
        session:session.id,
        title:title,
        body:body,
        creator: assignment.creator.id,
        files: selectedFile,
        deadline: deadline
    }
    formData.append('post_data', JSON.stringify(putPayload));
    formData.append('file', selectedFile)

    let response = await fetch(`${BaseUrl.baseUrl}/api/session/single-assignment/${session.id}/${assignment.id}/`,{
        method:"PUT",
        headers: {
            'Authorization': 'Bearer '+ String(authTokens?.access)
        },
        body: formData
    })

    if (response.status===200){
        updateSession()
        setSpinner(false)
        onRequestClose()
    }

  }

  
  const handleCloseBtn = ()=>{
    setTitle(assignment.title)
    setBody(assignment.body)
    setSelectedFile(files)
    setDeadline(deadline)
    onRequestClose()
  }


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
          <h2 className="card-title text-center text-green mb-3">Edit Assignment</h2>
          <form onSubmit={editAssignment} ref={formRef}>
            <div className="form-group">
                <input 
                    className="form-control" 
                    type="text" 
                    name='title' 
                    id="title" 
                    placeholder='Assignment Title'
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <div className="form-group mt-3">
              <textarea
                className="form-control"
                name='body'
                id="body"
                rows="6"
                placeholder="Description (Optional)"
                value={body}
                onChange={handleBodyChange}
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
                    <span>{selectedFile.name} </span>
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
                <label htmlFor="datetime" className='text-danger'>Submission Deadline:</label>
                <input
                    type="datetime-local" 
                    id="datePicker"
                    className='form-control'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={handleCloseBtn}>Cancel</button>
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

export default AssignEditPopup;
