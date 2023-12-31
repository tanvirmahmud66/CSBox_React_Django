import './App.css';

import Navbar from './Components/navbar/Navbar';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrattionPage from './pages/RegistrationPage/RegistrattionPage';
import HomePage from './pages/HomePage/HomePage';
import { useContext} from 'react';
import AuthContext from './context/AuthContext';
import VerficationPage from './pages/VerificationPage/VerficationPage';
import SingleSession from './pages/SingleSession/SingleSession';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { UserProfileProvider } from './context/ProfileContext';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';

function App() {

  let {user} = useContext(AuthContext)

  return (
      <Router basename='/'>
        <UserProfileProvider className="">
          <Navbar/>
          <div className='container'>
            <Routes>
              <Route path='/login' element={!user?<LoginPage/>: <Navigate to='/'/>}/>
              <Route path='/forget-password' element={!user?<ForgetPassword/>:<Navigate to='/'/>}/>
              <Route path='/new-user' element={!user?<RegistrattionPage/> : <Navigate to='/'/>}/>
              <Route path='/' element={user?<HomePage/>: <Navigate to='/login'/>}/>
              <Route path='/session/:id' element={user?<SingleSession/>: <Navigate to='/login'/>}/>
              <Route path='/profile/:id' element={user? <ProfilePage/>: <Navigate to='/login'/>}/>
              <Route path='/account/:id/:username/verified' element={<VerficationPage/>}/>
            </Routes>
          </div>
        </UserProfileProvider>
      </Router>
  );
}

export default App;
