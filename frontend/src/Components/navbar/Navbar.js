import React, { useContext} from 'react'
import './Navbar.css'
import brandLogo from '../../assets/BrandLogo/brand_logo3.png'
import AuthContext from '../../context/AuthContext'
import ProfileContext from '../../context/ProfileContext';
import { Link } from 'react-router-dom';
import search_icon from '../../assets/search.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

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
                            <div className='d-flex align-items-center'>
                                <form className="search-form" action="/search" method="GET">
                                    <input type="text" className="search-input" name="q" placeholder="Search..."/>
                                    <button type="submit" className="search-button">
                                        <img src={search_icon} alt="Search"/>
                                        <div>Search</div>
                                    </button>
                                </form>
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
                                    <Link to={`/profile/${user.user_id}`} className="dropdown-item2"><FontAwesomeIcon icon={faUser} /> Profile</Link>
                                    <div className="dropdown-item2 logout" onClick={userLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</div>
                                </div>
                            </div>
                        </>:
                        <>
                            <div></div>
                            <div className='nav-item btn-custom-group'>
                                <Link className='btn btn-warning' to='/new-user'>Signup</Link>
                                <Link className='btn btn-custom-green' to='/login'>Login</Link>
                            </div>
                        </>
                        }
                    </div>
                </div>
                <div className='responsive-div'>
                    {user? 
                        <div>
                            <form className="mt-2 mb-2 search-form" action="/search" method="GET">
                                    <input type="text" className="search-input" name="q" placeholder="Search..."/>
                                    <button type="submit" className="search-button">
                                        <img src={search_icon} alt="Search"/>
                                        <div>Search</div>
                                    </button>
                            </form>
                            <ul className="list-group mb-2">
                                <a className='text-decoration-none text-black' href='/'>
                                    <li className='list-group-item text-center'>
                                        <FontAwesomeIcon icon={faHome} /> Home
                                    </li>
                                </a>
                                <Link className='text-decoration-none text-black' to={`/profile/${user.user_id}`}>
                                    <li className="list-group-item text-center">
                                    <FontAwesomeIcon icon={faUser} /> Profile
                                    </li>
                                </Link>
                                <li className="list-group-item text-center text-danger cursor-pointer" onClick={userLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                </li>
                            </ul>
                        </div>:
                        <div className='w-100 d-flex flex-column mt-2 mb-2'>
                            <Link className='btn btn-warning' to='/new-user'>Signup</Link>
                            <Link className='btn btn-custom-green mt-2' to='/login'>Login</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar