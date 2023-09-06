import React, { useContext, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import RemoveMemberPopup from './RemoveMemberPopup';

const MemberListItem = ({each, session, sessionUpdate}) => {

    const baseUrl = 'http://127.0.0.1:8000';
    const{user,authTokens} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    // console.log(each)
    // console.log(session)
    // console.log(user)

    let removeMember = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/remove-member/${each.session}/${each.token}/${each.member.id}/`,{
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
        })

        if (response.status===204){
            sessionUpdate()
        }        
    }

    const openModal = () => {
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };


  return (
    <>
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className=''>
                <img className='avatar' src={baseUrl+each.member.profile.profile_pic}/>
                <Link to={`/profile/${each.member.id}`} className='text-decoration-none'>{each.member.first_name} {each.member.last_name}</Link>
            </div>
            {(session.host.id=== user.user_id) &&
                <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic"></Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openModal} className="text-danger">Remove</Dropdown.Item>
                        <Dropdown.Item>Block</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </li>
        <RemoveMemberPopup isOpen={isOpen} onRequestClose={closeModal} removeMember={removeMember} member={each}/>
    </>
  )
}

export default MemberListItem