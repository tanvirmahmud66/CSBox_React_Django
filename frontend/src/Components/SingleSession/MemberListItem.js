import React, { useContext, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import RemoveMemberPopup from './RemoveMemberPopup';
import BlockMemberPopup from './BlockMemberPopup';
import UnblockMemberPopup from './UnblockMemberPopup';
import BaseUrl from '../BaseUrl';


const MemberListItem = ({each, session, sessionUpdate, blocked}) => {

    
    const{user,authTokens} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    // console.log(each)
    // console.log(session)
    // console.log(user)

    let removeMember = async()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/remove-member/${each.session}/${each.token}/${each.member.id}/`,{
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

    let blockMember = async()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/block-member/${each.session}/${each.token}/${each.member.id}/`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
        })

        if (response.status===200){
            sessionUpdate()
        }
    }

    let unblockMember = async()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/block-member/${each.session}/${each.token}/${each.member.id}/`, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
        })

        if (response.status===200){
            sessionUpdate()
        }
    }

    const openModal = () => {
        setIsOpen(true);
    };

    const openModal2 = () => {
        setIsOpen2(true);
    }

    const openModal3 = ()=>{
        setIsOpen3(true)
    }
    
    const closeModal = () => {
        setIsOpen(false);
    };

    const closeModal2 = () => {
        setIsOpen2(false);
    }

    const closeModal3 = ()=>{
        setIsOpen3(false)
    }
    
    


  return (
    <>
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className=''>
                <img className='avatar' src={BaseUrl.baseUrl+each.member.profile.profile_pic} alt='avatar'/>
                <Link to={`/profile/${each.member.id}`} className='text-decoration-none'>{each.member.first_name} {each.member.last_name}</Link>
            </div>
            {(session.host.id === user.user_id) &&
                <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic"></Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                        {!blocked?
                        <>
                            <Dropdown.Item onClick={openModal} className="text-danger">Remove</Dropdown.Item>
                            <Dropdown.Item onClick={openModal2}>Block</Dropdown.Item>
                        </>:
                            <Dropdown.Item onClick={openModal3}>Unblock</Dropdown.Item>
                        }
                    </Dropdown.Menu>
                </Dropdown>
            }
        </li>
        <RemoveMemberPopup isOpen={isOpen} onRequestClose={closeModal} removeMember={removeMember} member={each}/>
        <BlockMemberPopup isOpen={isOpen2} onRequestClose={closeModal2} blockMember={blockMember} member={each}/>
        <UnblockMemberPopup isOpen={isOpen3} onRequestClose={closeModal3} unblockMember={unblockMember} member={each}/>
    </>
  )
}

export default MemberListItem