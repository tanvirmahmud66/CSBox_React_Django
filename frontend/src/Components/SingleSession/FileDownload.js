import React, { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AuthContext from '../../context/AuthContext';

// ===================================== Get File name
function getFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

// ===================================== open File
function openFile(url) {
    window.open(url, '_blank');
}


// =========================================== Main file functional Component
function FileDownloadComponent({ files, post,sessionUpdate }) {

  // console.log(files)

    const {user, authTokens} = useContext(AuthContext)

    let fileRemove = async(file_id)=>{
      let response = await fetch(`http://127.0.0.1:8000/api/single-file/${file_id}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(authTokens?.access)
        }
      })
      // let data = await response.json()
      console.log(response.status)
      if(response.status===204){
        sessionUpdate()
      }
    }
   
    return (
        <div className='container mt-2'>
          {files.map(file => (
            <div className='d-flex mb-2 justify-content-between align-items-center alert alert-primary custom-alert' key={file.id}>
              <div onClick={()=>openFile(file.file)} className='text-primary cursor-pointer w-100'>{getFileNameFromUrl(file.file)}</div>
              <Dropdown>
                <Dropdown.Toggle
                 size='sm' 
                 variant="" 
                 id="dropdown-basic"
                 ></Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item
                        href={`data:application/octet-stream;base64,${file.file_data}`}
                        download={getFileNameFromUrl(file.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => openFile(file.file)}>Open</Dropdown.Item>
                    {user.user_id===post.creator.id && <Dropdown.Item onClick={()=> fileRemove(file.id)} className='text-danger'>Remove</Dropdown.Item>}
                    
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
        </div>
      );
    }

    

export default FileDownloadComponent;
