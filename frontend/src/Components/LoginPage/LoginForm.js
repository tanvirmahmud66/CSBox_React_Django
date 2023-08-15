import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext';

const LoginForm = () => {

    let {userLogin} = useContext(AuthContext)

  return (
    <>
        <div className="card mw-50 bg-custom-light-dark">
            <div className="card-header text-center">
                <h4>Login</h4>
            </div>
            <div className="card-body">
                <form onSubmit={userLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' className="form-control bg-dark text-white" id="username" placeholder="Enter username"/>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' className="form-control bg-dark text-white" id="password" placeholder="Password"/>
                    </div>
                    <button type='submit' className='btn w-100 mt-4 btn-custom-green'>Login</button>
                    <div className='d-flex flex-column mt-2'>
                        <a href='#' className='text-decoration-none text-center'>Forget password?</a>
                        <a href='/new-user' className='text-decoration-none text-center'>Don't have an account?</a>
                    </div>
                    
                </form>
            </div>
        </div>
    </>
  )
}

export default LoginForm;