import Modal from 'react-modal';
import React, { useContext, useState , useRef} from 'react';
import AuthContext from '../../context/AuthContext';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CreateAssignmentPopup({isOpen, onRequestClose, session_id, session_update}) {

  const formRef = useRef();

  const {user,authTokens} = useContext(AuthContext)
  
  const [selectedFile, setSelectedFile] = useState();
  const [deadline, setDeadline] = useState();


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
  };

  const handleFileRemove = (fileName) => {
    setSelectedFile(null);
  };

  const handleDateChange = (date) => {
    setDeadline(date);
  };


  let createAssignment = async(e)=>{
      e.preventDefault()
      const formData = new FormData();
      const postPayload = {
        session: session_id,
        title: e.target.title.value,
        body: e.target.body.value,
        creator: user.user_id,
        files: selectedFile,
        deadline: deadline.toISOString()
      }
      formData.append('post_data', JSON.stringify(postPayload));
      formData.append('file', selectedFile)

      let response = await fetch(`http://127.0.0.1:8000/api/session/assignment/${session_id}/`,{
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
        formRef.current.reset();
        onRequestClose()
        setSelectedFile(null);
        setDeadline('')
      }

      // onRequestClose()
      // setSelectedFile(null);
      // setDeadline('')
      
  };

   

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Example Modal"
    className="modal-content"
    overlayClassName="modal-overlay custom-backdrop"
    >
      <div className="card w-50">
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
            
            {/* <div className="form-group mt-2">
                <label htmlFor="datePicker" className='text-danger'>Submission Deadline :</label>
                <input type="date" id="datePicker" className='w-100' value={deadline} onChange={handleDateChange} required/>
            </div> */}
                
            <div className="form-group">
                <label htmlFor="datePicker" className='text-danger'>Submission Deadline:</label>
                <DatePicker
                    selected={deadline}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    placeholderText='Data and Time'
                    required
                />
            </div>

            <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Cancel</button>
                <button type="submit" className="btn btn-custom-green ms-2">Create Assignment</button>
            </div>
          </form>
        </div>
      </div>
      </Modal>
  );
}

export default CreateAssignmentPopup;
