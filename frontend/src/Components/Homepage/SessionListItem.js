import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import DeletePopup from './DeletePopup';
import LeavePopup from './LeavePopup';
import EditModal from './EditPopup';

const SessionListItem = ({session, updateSession}) => {
    const {title, details, created, token} = session;
    const {id,first_name, last_name} = session.host;
    const {user, authTokens} = useContext(AuthContext)


    let deleteSession = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/single-session/${session.id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        let data = await response.json()
        console.log(data)
        if (response.status===200){
            updateSession()
        }
    }

    let leaveSession = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/leave-session/${session.id}/${token}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        let data = await response.json()
        if (response.status===200){
            updateSession()
        }
    }



    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [leaveOpen, setLeaveOpen] = useState(false);

    // =======================Delete Modal
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    // ===================== Edit Model
    const editOpenModal = () =>{
        setEditOpen(true);
    }
    const editCloseModal = () =>{
        setEditOpen(false);
    }

    // ====================== Leave Modal
    const leaveOpenModal = () => {
        setLeaveOpen(true)
    }
    const leaveCloseModal = () =>{
        setLeaveOpen(false)
    }

  return (
    
    <div className='mb-3'>
        {/* <Link to={`/session/${props.session.id}`} className='text-decoration-none'> */}
        <div className={`card ${user.user_id===id? 'bg-custom-violet': 'bg-custom-blue'} `}>
            <div className='card-body d-flex justify-content-between align-items-center'>
                <div className="col-md-5 settings-element">
                    <h5>{title}</h5>
                    <h6 className='text-p'>{details} </h6>
                </div>
                <div className='text-center settings-element'>
                    <h5 className='text-title'>{first_name} {last_name}</h5>
                    <h6 className='text-p'>Created: {created.substring(0, 10)}</h6>
                </div>

                <div className='settings-element-responsive'>
                    <div>
                        <h5>{title}</h5>
                        <h6 className='text-p'>{details}</h6>
                        <h6 className='text-p'>{first_name} {last_name}</h6>
                        <h6 className='text-p'>Created: {created.substring(0,10)}</h6>
                    </div>
                </div>
                
                {(user.user_id===id)?
                    <div className='btn-group'>
                        <button onClick={editOpenModal} className='btn btn-warning'>Edit</button>
                        <button onClick={openModal} className='btn btn-secondary'>Delete</button>
                    </div>:
                    <button onClick={leaveOpenModal} className='btn btn-warning'>Leave session</button>
                }               

            </div>
        </div>
        {/* </Link> */}
        <DeletePopup isOpen={isOpen} onRequestClose={closeModal} title={title} deleteSession={deleteSession}/>
        <EditModal isOpen={editOpen} onRequestClose={editCloseModal} session={session} sessionUpdate={updateSession}/>
        <LeavePopup isOpen={leaveOpen} onRequestClose={leaveCloseModal} title={title} leaveSession={leaveSession}/>
    </div>
    
  )
}

export default SessionListItem;