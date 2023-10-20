import React, { useContext} from 'react'
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginForm = () => {

    let { loginError,userLogin} = useContext(AuthContext)
    

  return (
    <>
        <div className="card fixed-height2 mw-50">
            <div className="card-header p-0 text-center">
                {(loginError.error && loginError.status==='NOT VERIFIED') &&
                    <div className="alert mb-0 alert-warning" role="alert">
                        {loginError.text}
                    </div>
                }
                {(loginError.error && loginError.status===401) &&
                    <div className="alert mb-0 alert-danger" role="alert">
                        Invalid username or password !!
                    </div>
                }
                {!loginError.error && 
                    <div className='p-2'>
                        <h4>Login</h4> 
                    </div>
                }
            </div>
            <div className="card-body">
                <form onSubmit={userLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' className="form-control" id="username" placeholder="username" required/>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' className="form-control" id="password" placeholder="password" required/>
                    </div>
                    <button type='submit' className='btn w-100 mt-4 btn-custom-green'>Login</button>
                    <div className='d-flex justify-content-between align-items-center mt-2'>
                        <Link to='/forget-password' className='text-decoration-none text-center'>Forget password?</Link>
                        <Link to='/new-user' className='text-decoration-none text-center'>Don't have an account?</Link>
                    </div>
                    
                </form>
            </div>
        </div>
    </>
  )
}

export default LoginForm;