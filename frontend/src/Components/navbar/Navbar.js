import React, { useContext} from 'react'
import './Navbar.css'
import brandLogo from '../../assets/BrandLogo/brand_logo2.png'
import AuthContext from '../../context/AuthContext'
import ProfileContext from '../../context/ProfileContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    let {user,userLogout} = useContext(AuthContext)
    let {userProfilePic} = useContext(ProfileContext)

  return (
    <nav className="navbar p-1 navbar-expand-lg nav-custom-bg sticky-top">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img width={150} className='img-fluid' src={brandLogo} alt='brandlogo'/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className='d-none-991 w-100'>
                    <div className='w-100 d-flex justify-content-between'>
                        {user?
                        <>
                            <div className='w-40 d-flex align-items-center'>
                                <div className="w-100 input-group">
                                    <input type="search" className="input-bg w-75" placeholder="search" aria-label="search" aria-describedby="button-addon2"/>
                                    <button className="btn btn-secondary w-25" type="button" id="button-addon2">Search</button>
                                </div>
                            </div>

                            {/* user toggle button */}
                            <div className="dropdown2">
                                <button className="btn btn-custom2-green p-1 pe-3 ps-2 d-flex align-items-center" id="dropdown-basic">
                                    <div className="avatar">
                                        <img src={userProfilePic} alt="Profile Picture"/>
                                    </div>
                                    <div className="username text-p">{user.username}</div>
                                </button>
                                <div className="dropdown-menu2">
                                    <Link to={`/profile/${user.user_id}`} className="dropdown-item2">Profile</Link>
                                    <div className="dropdown-item2 logout" onClick={userLogout}>Logout</div>
                                </div>
                            </div>
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
                <div className='responsive-div'>
                    {user? 
                        <div>
                            <div className="w-100 input-group mt-2 mb-2">
                                <input type="search" className="input-bg w-75" placeholder="search" aria-label="search" aria-describedby="button-addon2"/>
                                <button className="btn btn-secondary w-25" type="button" id="button-addon2">Search</button>
                            </div>
                            <ul className="list-group mb-2">
                                <li className='list-group-item text-center'>
                                    <a className='text-decoration-none text-black' href='/'>Home</a>
                                </li>
                                <li className="list-group-item text-center">
                                    <Link className='text-decoration-none text-black' to={`/profile/${user.user_id}`}>Profile</Link>
                                </li>
                                <li className="list-group-item text-center text-danger cursor-pointer" onClick={userLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>:
                        <div className='w-100 d-flex flex-column mt-2 mb-2'>
                            <Link className='btn btn-custom-green' to='/new-user'>Signup</Link>
                            <Link className='btn btn-primary mt-2' to='/login'>Login</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar