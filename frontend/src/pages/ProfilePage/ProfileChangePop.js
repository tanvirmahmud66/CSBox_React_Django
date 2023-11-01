import React, { useContext, useRef, useState } from 'react'
import Modal from 'react-modal';
import AuthContext from '../../context/AuthContext';
import BaseUrl from '../../Components/BaseUrl';

const ProfileChangePop = ({ isOpen, onRequestClose, profileID, getProfile}) => {

    const formRef = useRef()

    const{authTokens} = useContext(AuthContext)
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    let editProfileApi = async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append('profile_pic', selectedImage);
        let response = await fetch(`${BaseUrl.baseUrl}/api/profile/${profileID}/`,{
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
            body: formData
        })

        let data = await response.json()
        console.log(data)
        if (response.status===200){
            getProfile()
            onRequestClose()
        }
    }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="card my-card">
        <div className='card-header'>
            <h2 className='text-center'>Change Profile</h2>
        </div>
        <div className='card-body'>
        <form onSubmit={editProfileApi} ref={formRef}>
              <div className="form-group mb-2">
                <label htmlFor="profile">Upload Profile</label>
                <input 
                    type="file" 
                    name='profile' 
                    className="form-control" 
                    id="profile"
                    onChange={handleImageChange}
                    required
                />
              </div>
              
              <div className='d-flex justify-content-end align-items-center mt-3'>
                <button className='btn btn-custom-danger' onClick={onRequestClose}>Close</button>
                <button type="submit" className="btn btn-custom-green ms-2">Change Profile</button>
              </div>
            </form>
        </div>
        
      </div>
    </Modal>
  )
}

export default ProfileChangePop