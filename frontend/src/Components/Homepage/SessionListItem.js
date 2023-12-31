import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import DeletePopup from './DeletePopup';
import LeavePopup from './LeavePopup';
import EditModal from './EditPopup';
import BaseUrl from '../BaseUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SessionListItem = ({session, updateSession}) => {
    const {title, details, created, token} = session;
    const {id,first_name, last_name} = session.host;
    const {user, authTokens} = useContext(AuthContext)
    const [spinner, setSpinner] = useState(false)


    let deleteSession = async()=>{
        setSpinner(true)
        let response = await fetch(`${BaseUrl.baseUrl}/api/single-session/${session.id}/`, {
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
            setSpinner(false)
        }
    }

    let leaveSession = async()=>{
        setSpinner(true)
        let response = await fetch(`${BaseUrl.baseUrl}/api/leave-session/${session.id}/${token}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        // let data = await response.json()
        if (response.status===200){
            updateSession()
            setSpinner(false)
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
                        <button onClick={editOpenModal} className='btn btn-warning'><FontAwesomeIcon icon={faEdit}/> Edit</button>
                        <button onClick={openModal} className='btn btn-secondary'><FontAwesomeIcon icon={faTrash} /> Delete</button>
                    </div>:
                    <button onClick={leaveOpenModal} className='btn btn-warning'><FontAwesomeIcon icon={faSignOutAlt} /> Leave session</button>
                }               

            </div>
        </div>
        {/* </Link> */}
        <DeletePopup isOpen={isOpen} onRequestClose={closeModal} title={title} deleteSession={deleteSession} spinner={spinner}/>
        <EditModal isOpen={editOpen} onRequestClose={editCloseModal} session={session} sessionUpdate={updateSession}/>
        <LeavePopup isOpen={leaveOpen} onRequestClose={leaveCloseModal} title={title} leaveSession={leaveSession} spinner={spinner}/>
    </div>
    
  )
}

export default SessionListItem;