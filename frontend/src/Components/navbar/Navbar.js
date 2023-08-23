import React, { useContext} from 'react'
import './Navbar.css'
import brandLogo from '../../assets/BrandLogo/brand_logo.png'
import AuthContext from '../../context/AuthContext'

const Navbar = () => {
    let {user, userLogout} = useContext(AuthContext)
    // console.log(user)

  return (
    <nav className="navbar navbar-expand-lg nav-custom-bg sticky-top">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img width={150} className='img-fluid' src={brandLogo} alt='brandlogo'/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className='container d-flex justify-content-end'>
                    {user?
                     <>
                        <div className="nav-item search-bar input-group">
                            <input type="search" className="input-bg" placeholder="search" aria-label="search" aria-describedby="button-addon2"/>
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
                        </div>
                        <div className='nav-item d-flex justify-content-between align-items-center me-4'>
                            <div className="avatar">
                                <img src="https://via.placeholder.com/150" alt="Profile Picture"/>
                            </div>
                            <div>{user.username}</div>
                        </div>
                        <button onClick={userLogout} className='btn btn-custom2-green'>Logout</button>
                    </>:
                    <div className='nav-item btn-custom-group'>
                        <a className='btn btn-custom2-green' href='/new-user'>Signup</a>
                        <a className='btn btn-custom2-primary' href='/login'>Signin</a>
                    </div>
                    }
                    
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar