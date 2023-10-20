import React, { useContext} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import './Navbar.css'
import brandLogo from '../../assets/BrandLogo/brand_logo2.png'
import AuthContext from '../../context/AuthContext'
import DefaultPic from '../../assets/defaultPic.jpeg'
import ProfileContext from '../../context/ProfileContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    let {user,userLogout} = useContext(AuthContext)
    let {userProfile, userProfilePic} = useContext(ProfileContext)

  return (
    <nav className="navbar p-0 navbar-expand-lg nav-custom-bg sticky-top">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img width={150} className='img-fluid' src={brandLogo} alt='brandlogo'/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse custom-container d-flex justify-content-end navbar-collapse" id="navbarSupportedContent">
                <div className='w-100 d-flex justify-content-between'>
                    {user?
                     <>
                        <div className='w-40 d-flex align-items-center'>
                            <div className="w-100 input-group">
                                <input type="search" className="input-bg w-75" placeholder="search" aria-label="search" aria-describedby="button-addon2"/>
                                <button className="btn btn-outline-secondary w-25" type="button" id="button-addon2">Search</button>
                            </div>
                        </div>

                        {/* user toggle button */}
                        <Dropdown className='p-1'>
                            <Dropdown.Toggle className='btn btn-custom2-gray d-flex justify-content-center align-items-center p-1' variant="secondary" id="dropdown-basic">
                                <div className="avatar">
                                    <img src={userProfilePic} alt="Profile Picture"/>
                                </div>
                                <div className='me-1'>{user.first_name}</div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={`/profile/${user.user_id}`}>
                                        Profile
                                </Dropdown.Item>
                                <Dropdown.Item onClick={userLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>:
                    <>
                    <div></div>
                    <div className='nav-item btn-custom-group'>
                        <Link className='btn btn-custom2-green' to='/new-user'>Signup</Link>
                        <Link className='btn btn-custom2-primary' to='/login'>Login</Link>
                    </div>
                    </>
                    }
                    
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar