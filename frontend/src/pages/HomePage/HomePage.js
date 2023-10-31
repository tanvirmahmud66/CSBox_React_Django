import React, {useState, useEffect, useContext} from 'react'
import CustomModal from '../../Components/Homepage/Modal';
import AuthContext from '../../context/AuthContext';
import Session from '../../Components/Homepage/Session';
import CreateSession,{EmptySession} from '../../Components/Homepage/EmptySession';
import SessionListItem from '../../Components/Homepage/SessionListItem';
import Dropdown from 'react-bootstrap/Dropdown';



const HomePage = () => {

  const {authTokens} = useContext(AuthContext);
  

  const[session, setSession] = useState([]);
  const[sessionJoin, setSessionJoin] = useState([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  
  let [notificaiton, setNotification] = useState(null)
  let [joinNotify, setJoinedNotify] = useState(null)
  let [spinner, setSpinner] = useState(false)

  let [settings, setSettings] = useState(false)

  const[createdSession, setCreatedSession] = useState(true)
  const[joinedSession, setJoinedSession] = useState(false)
  const[conversation, setConversation] = useState(false)
  const[profile, setProfile] = useState(false)
  const[account, setAccount] = useState(false)

  let [created, setCreated] = useState(true)
  let [joined, setJoined] = useState(false)
  let [createdSetting, setCreatedSetting] = useState(false)
  let [joinedSetting, setJoinedSetting] = useState(false)

  let createdHandle = ()=>{
    setCreated(true)
    setJoined(false)
    setCreatedSetting(false)
    setJoinedSetting(false)
  }
  
  let joinedHandle = ()=>{
    setJoined(true)
    setCreated(false)
    setCreatedSetting(false)
    setJoinedSetting(false)
  }

  let joinedSettingHandle = ()=>{
    setJoined(false)
    setCreated(false)
    setCreatedSetting(false)
    setJoinedSetting(true)
    setSettings(true)
    setJoinedSession(true)
    setCreatedSession(false)
  }

  let createdSettingHandle = ()=>{
    setJoined(false)
    setCreated(false)
    setCreatedSetting(true)
    setSettings(true)
    setCreatedSession(true)
    setJoinedSession(false)
    setJoinedSetting(false)
  }

  

  let getSession = async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/new-session/',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ String(authTokens?.access)
      },
    })
    let data = await response.json()
    // console.log(data)
    if (response.status===200){
      setSession(data.data)
      setSessionJoin(data.join)
    }
    
  }

  let joinSession = async(e)=>{
    e.preventDefault()
    setSpinner(true)
    let response = await fetch('http://127.0.0.1:8000/api/join-session/',{
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
        "Authorization": "Bearer " + String(authTokens.access)
      },
      body: JSON.stringify({
        "token": e.target.token.value
      })
    })
    let data = await response.json()
    console.log(data)
    e.target.token.value = '';

    if(response.status !==200){
      setNotification(response.statusText)
      setSpinner(false)
    }else{
      setJoinedNotify("Joining Accepted")
      setSpinner(false)
      getSession()
    } 
  }

  useEffect(()=>{
    setTimeout(()=>{
      setNotification(null)
      setJoinedNotify(null)
    }, 4000)
  }, [notificaiton, joinNotify])



  useEffect(()=>{
    getSession()
    // const interval = setInterval(() => {
    //   getSession()
    // }, 3000);
    // return ()=> clearInterval(interval)    
  }, [])

  

  useEffect(()=>{
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  // ============================= Settings

  

  let setBtnHandle = (buttonName)=>{
    if (buttonName==='joinedSession'){
      setProfile(false)
      setAccount(false)
      setConversation(false)
      setJoinedSession(true)
      setCreatedSession(false)
    }
    if(buttonName==='createdSession'){
      setProfile(false)
      setAccount(false)
      setConversation(false)
      setJoinedSession(false)
      setCreatedSession(true)
    }
  }


  return (
    <>
    <div className='d-none-991'>
      <div className={`row p-2 d-flex justify-content-between align-items-center sticky-element  ${isSticky ? 'sticky-background' : ''}`}>
        <div className='d-flex justify-content-between align-items-center'>
          {!settings && 
          <div className='d-flex justify-content-between align-items-center'>
            <div className='text-capitalize fs-5'>session :</div>
            <form className='d-flex ms-2 me-2' onSubmit={joinSession}>
              <div className='from-group '>
                <input type='text' name='token' className='form-control position-relative' id='token' placeholder='token' required></input>
                {notificaiton!==null &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-danger start-2 p-3">
                    {notificaiton}
                  </div>
                }
                {joinNotify &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-green start-2 p-3">
                    {joinNotify}
                  </div>
                }
              </div>
              {/* <button type='submit' className='btn bg-primary text-white ms-2'>Join</button> */}
              {spinner ?
                  <button className="btn btn-primary ms-1" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="visually-hidden">Joining..</span>
                  </button>:
                  <button type='submit' className='btn bg-primary text-white ms-2'>Join</button>
                }
            </form>
            <button onClick={openModal} className='btn btn-custom2-green'>Create</button>
          </div>}
          <button onClick={(()=> setSettings(!settings))} className={`btn ${settings? 'btn-custom2-green':'btn-custom2-danger'}`}>{settings? "Back to Home":"Settings"}</button>
        </div>
      </div>
      
      {!settings && 
        <div className='mt-4 mb-5'>
          <div className="container">
              <div className="row">
                  <div className='col'>
                    <h4 className='text-violet'>Created</h4>
                    <div className='scroll-container'>
                      <div className='row'>
                        {session && session.map((each)=>{return (<Session key={each.id} session={each}/>)})}
                        {session.length===0 && <CreateSession/>}
                      </div>
                    </div>
                  </div>
                  <div className='col'>
                    <h4 className='text-blue'>Joined</h4>
                    <div className='col scroll-container'>
                      <div className='row'>
                        
                        {sessionJoin!==undefined? sessionJoin.map((each)=>{
                            return (
                              <Session key={each.id} session={each}/>
                            )
                          }): <EmptySession/>}
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      }

      {settings && 
        <div className='mt-2 vh-80 row'>
          {/* =============================== operation button list */}
          <div className='col-3'>
            <div className='card fs-5 text-danger text-center p-2 mb-3'>Settings</div>
            <ul className="list-group">
              {/* <li onClick={()=>setBtnHandle("profile")} className={`mb-3 text-white btn ${profile?"btn-custom-green border-green":"btn-custom2-primary"}`}>Profile</li>
              <li onClick={()=>setBtnHandle("account")} className={`mb-3 text-white btn ${account?"btn-custom-green border-green":"btn-custom2-primary"}`}>Account</li>
              <li onClick={()=>setBtnHandle("conversation")} className={`mb-3 text-white btn ${conversation?"btn-custom-green border-green":"btn-custom2-primary"}`}>Conversation</li> */}
              <li onClick={()=>setBtnHandle("createdSession")} className={`mb-3 text-white btn ${createdSession?"btn-custom-green border-green":"btn-custom2-primary"}`}>Created Session</li>
              <li onClick={()=>setBtnHandle("joinedSession")} className={`mb-3 text-white btn ${joinedSession?"btn-custom-green border-green":"btn-custom2-primary"}`}>Joined Session</li>
            </ul>
          </div>

          {/* Created session settings section */}
          {createdSession &&
              <div className='col-9'>
                <div className='ms-2'>
                  {session && session.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)})}
                  {session.length===0 && <CreateSession/>}
                </div>
              </div>
          }

          {joinedSession &&
              <div className='col-9'>
                <div className='ms-2'>
                  {sessionJoin!==undefined?
                   sessionJoin.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)}):
                    <EmptySession/>
                  }
                </div>
              </div>
          }

          {conversation &&
            <div className='col-9'>
              <div className='ms-2'>
                Conversation settings
              </div>
            </div>
          }

          {profile &&
            <div className='col-9'>
              <div className='ms-2'>
                Profile settings
              </div>
            </div>
          }

          {account &&
            <div className='col-9'>
              <div className='ms-2'>
                Account settings
              </div>
            </div>
          }
          
        </div>
      }

    </div>
    <div className='responsive-div'>
      <div className='d-flex justify-content-between aling-items-center mt-2'>
            <form className='d-flex me-2' onSubmit={joinSession}>
              <div className='from-group '>
                <input type='text' name='token' className='form-control position-relative' id='token' placeholder='token' required></input>
                {notificaiton!==null &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-danger start-2 p-3">
                    {notificaiton}
                  </div>
                }
                {joinNotify &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-green start-2 p-3">
                    {joinNotify}
                  </div>
                }
              </div>
              <button type='submit' className='btn bg-primary text-white ms-2'>Join</button>
            </form>
            <button onClick={openModal} className='btn btn-custom2-green'>Create</button>
      </div>
      
      <div>
        <div className='mt-4 mb-4'>
          <div className='d-flex justify-content-between align-items-center'>
            <Dropdown>
              <Dropdown.Toggle className='btn btn-custom2-gray d-flex justify-content-center align-items-center p-1' variant="secondary" id="dropdown-basic">
                <div className='me-1'>{created?"Created Session": "Joined Session"}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={createdHandle}>Created Session</Dropdown.Item>
                <Dropdown.Item onClick={joinedHandle}>Joined Session</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle className='btn btn-custom2-danger d-flex justify-content-center align-items-center p-1' variant="secondary" id="dropdown-basic">
                <div className='me-1'>Settings</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={createdSettingHandle}>Created</Dropdown.Item>
                <Dropdown.Item onClick={joinedSettingHandle}>Joined</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
            <div className=''>
              {created &&
                <div>
                  {session && session.map((each)=>{return (<Session key={each.id} session={each}/>)})}
                  {session.length===0 && <CreateSession/>}
                </div>
              }

              {joined &&
                <div>
                  {sessionJoin!==undefined? sessionJoin.map((each)=>{
                      return (
                          <Session key={each.id} session={each}/>
                      )
                  }): <EmptySession/>}
                </div>
              }

              {createdSetting &&
                <>
                  <div className='mt-2 mb-2 p-2 text-center fs-3 text-danger bg-white'>Created Session Setting</div>
                  <div className='mt-2'>
                    {session && session.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)})}
                    {session.length===0 && <CreateSession/>}
                  </div>
                </>
              }

              {joinedSetting &&
                <>
                  <div className='mt-2 mb-2 p-2 text-center fs-3 text-danger bg-white'>Joined Session Setting</div>
                  <div className='mt-2'>
                    {sessionJoin!==undefined?
                      sessionJoin.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)}):
                      <EmptySession/>
                    }
                  </div>
                </>
              }
            </div>
        </div>
      </div>

    </div>
      <CustomModal isOpen={isOpen} onRequestClose={closeModal} get={getSession} />
    </>
  )
}

export default HomePage